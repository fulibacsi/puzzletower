class Player {

    constructor(name, offsetX, offsetY) {
        this.name = name;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.tower = [];
        this.visible = [];
        this.score = 0;
        this.wins = 0;
    }

    add_shape(next, next_img, scene) {
        var score_diff = 0;
        // init shape
        if (this.tower.length == 0) {
            this.tower.push(next);

            next_img.setPosition(this.offsetX, this.offsetY + (7 - this.height()) * 32);
            this.visible.push(next_img);
        }

        else if (shape.check_compatibility(this.tower[this.tower.length - 1], next)) {
            // add to player's tower
            this.tower.push(next);

            // add to visible part
            next_img.setPosition(this.offsetX, this.offsetY + (7 - this.height()) * 32);
            this.visible.push(next_img);

            if (this.visible.length > 5) {
                this.level_up();
            }

            // update score
            score_diff = this.update_score();
        }

        else {
            // collapse automatically updates scores (so it can be called from the outside)
            score_diff = this.collapse(scene);
        }

        // console.log(this.name, ' score diff after adding: ', score_diff);
        // return score diff
        return score_diff;
    }

    level_up() {
        console.log(this.name + ' LVLUP!');
        for (var img of this.visible.slice(0, this.visible.length - 1)) {
            img.destroy();
        }
        this.visible = this.visible.slice(this.visible.length - 1);
        this.visible[0].setPosition(this.offsetX, this.offsetY + 7 * 32);
    }

    collapse(scene) {
        console.log(this.name + ' COLLAPSE!');
        if (this.height() > 1) {
            // console.log('tower before: ', this.tower.length, ' vis before: ', this.visible,
            //             ' size after:', Math.max(1, this.tower.length - this.height() + 1),
            //             ' vis del size: ', this.visible.slice(1).length);
            this.tower = this.tower.slice(0, Math.max(1, this.tower.length - this.height() + 1));



            for (var img of this.visible.slice(1)) {
                var explosion = scene.add.sprite(img.x + 8, img.y + 8, 'explosion').setOrigin(0, 0).setDepth(2);
                scene.anims.create({
                    key: 'exp',
                    frames: scene.anims.generateFrameNumbers('explosion', { start: 0, end: 33 }),
                    frameRate: 60,
                    repeat: 0
                });
                explosion.play('exp');
                img.destroy();
            }
            this.visible = this.visible.slice(0, 1);
            this.visible[0].setPosition(this.offsetX, this.offsetY + 7 * 32);
        }
        // console.log(this.name, 'TOWERAFTER:', this.tower, 'VISAFTER:', this.visible);

        // update score & return diff
        return this.update_score();
    }

    base_shape() {
        return this.tower[this.tower.length - 1];
    }

    height() {
        return this.visible.length;
    }

    update_score() {
        console.log(this.name, ' UPDATE SCORE');
        var prev = this.score;
        var tower = this.tower;

        // do not calculate the first shape
        var score = tower.length - 1;

        // calculate bonus scores
        if (tower.length > 1) {

            // double color -> sum 2x2 points - 2x1 base points = 2x1 extra points = 2 pts
            for (var i = 0; i < tower.length - 1; i++) {
                if (shape.check_color(tower[i], tower[i + 1])) {
                    score += 2;
                }
            }

            // triple color -> sum 3x3 points - 3x1 base points - 2x2 extra from double bonus = 9 - 3 - 4 pts = 2 pts
            if (tower.length > 2) {
                for(var i = 0; i < tower.length - 2; i+=2) {
                    if (shape.check_color(tower[i], tower[i + 1]) && shape.check_color(tower[i + 1], tower[i + 2])) {
                        score += 2;
                    }
                }
            }
        }

        // update score
        this.score = score;

        // console.log('new score: ', this.score, ' prev score:', prev, ' diff: ', score-prev);
        // return score diff
        return score - prev;
    }

    reset() {
        this.score = 0;
        this.tower = [];

        for (var img of this.visible) {
            img.destroy();
        }
        this.visible = [];


    }
}
