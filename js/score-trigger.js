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
import { Component, Type } from "@wonderlandengine/api";

var score = 0;
var victoryMusic = null;
var gameOver = false;
/**
@brief Score trigger

Check overlap with paper balls to spawn confetti particles and
increase the score.

This component is automatically attached to newly spawned wastebins,
see `wastebin-spawner`.
*/
export class ScoreTrigger extends Component {
  static TypeName = "score-trigger";
  static Properties = {
    particles: { type: Type.Object },
  };

  init() {
    this.collision = this.object.getComponent("collision");
    this.soundHit = this.object.addComponent("howler-audio-source", {
      src: "sfx/high-pitched-aha-103125.mp3",
      volume: 1.9,
    });
    this.soundPop = this.object.addComponent("howler-audio-source", {
      src: "sfx/pop-94319.mp3",
      volume: 1.9,
    });
    victoryMusic = this.object.addComponent("howler-audio-source", {
      src: "music/level-win-6416.mp3",
      volume: 1.9,
    });
  }

  update(dt) {
    let overlaps = this.collision.queryOverlaps();

    for (let i = 0; i < overlaps.length; ++i) {
      let p = overlaps[i].object.getComponent("bullet-physics");

      if (p && !p.scored) {
        p.scored = true;
        this.particles.transformWorld.set(this.object.transformWorld);
        this.particles.getComponent("confetti-particles").burst();
        this.object.parent.destroy();

        ++score;

        let scoreString = "";
        if (maxTargets != score) {
          scoreString = score + " rats down, " + (maxTargets - score) + " left";
        } else {
          scoreString = "Congrats, you got all the rats!";
          victoryMusic.play();
          bgMusic.stop();
          mouseSound.stop();
          resetButton.unhide();
          gameOver = true;
        }

        updateScore(scoreString);

        this.soundHit.play();
        this.soundPop.play();
      }
    }
  }
}
