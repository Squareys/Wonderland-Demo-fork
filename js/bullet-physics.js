import { Component, Type } from "@wonderlandengine/api";
import { vec3 } from "gl-matrix";

/*
      Copyright 2021. Futurewei Technologies Inc. All rights reserved.
      Licensed under the Apache License, Version 2.0 (the "License");
      you may not use this file except in compliance with the License.
      You may obtain a copy of the License at
        http:  www.apache.org/licenses/LICENSE-2.0
      Unless required by applicable law or agreed to in writing, software
      distributed under the License is distributed on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      See the License for the specific language governing permissions and
      limitations under the License.
*/
/**
@brief Bullet Physics

*/
export class BulletPhysics extends Component {
  static TypeName = "bullet-physics";
  static Properties = {
    speed: { type: Type.Float, default: 1.0 },
  };

  init() {
    this.dir = new Float32Array(3);
    this.position = [0, 0, 0];
    this.object.getTranslationWorld(this.position);
    this.correctedSpeed = this.speed / 6;

    this.collision = this.object.getComponent("collision", 0);
    if (!this.collision) {
      console.warn(
        "'bullet-physics' component on object",
        this.object.name,
        "requires a collision component"
      );
    }
  }

  update(dt) {
    //error checking?
    if (isNaN(dt)) {
      console.log("dt is NaN");
      return;
    }

    //update position
    this.object.getTranslationWorld(this.position);
    //deactivate bullet if through the floor
    if (this.position[1] <= floorHeight + this.collision.extents[0]) {
      this.active = false;
      return;
    }
    //deactivate bullet if travel distance too far
    if (glMatrix.vec3.length(this.position) > 175) {
      this.active = false;
      return;
    }

    let newDir = [0, 0, 0];
    vec3.add(newDir, newDir, this.dir);
    vec3.scale(newDir, newDir, this.correctedSpeed);

    vec3.add(this.position, this.position, newDir);

    this.object.resetTranslation();
    this.object.translate(this.position);
  }
}
