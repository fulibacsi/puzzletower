class Player {

    constructor(name, offsetX, offsetY) {
        this.name = name;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.tower = [];
        this.visible = [];
        this.score = 0;
        this.wins = 0;
        this.active_effects = [];
    }

    add_shape(scene, next) {
        var score_diff = 0;
        // init shape
        if (this.tower.length == 0) {
            this.tower.push(next);

            next.setPosition(this.offsetX, this.offsetY + (7 - this.height()) * 32);
            this.visible.push(next);
        }

        else if (this.tower[this.tower.length - 1].check_compatibility(next)) {
            // add to player's tower
            this.tower.push(next);

            // with this shape, tower levels up
            if (this.visible.length > 4) {
                this.visible.push(next);
                this.level_up(scene);
            }

            // add item without level up
            else {
                let x = this.offsetX;
                let y = this.offsetY + (7 - this.height()) * 32;
                utils.moveTo(scene, next, x, y, 3,
                             utils.play_animation, [scene, 'dust', x, y]);
                this.visible.push(next);
            }

            // update score
            score_diff = this.update_score();
        }

        // collapse automatically updates scores (so it can be called from the outside)
        else {
            score_diff = this.collapse(scene);
        }

        return score_diff;
    }

    level_up(scene) {
        console.log(this.name + ' LVLUP!');

        for (var img of this.visible.slice(0, this.visible.length - 1)) {
            img.destroy();
        }
        this.visible = this.visible.slice(this.visible.length - 1);
        utils.moveTo(scene, this.visible[0], this.offsetX, this.offsetY + 7 * 32, 3);
    }

    collapse(scene) {
        console.log(this.name + ' COLLAPSE!');

        if (this.height() > 1) {
            this.tower = this.tower.slice(0, Math.max(1, this.tower.length - this.height() + 1));

            for (var img of this.visible.slice(1)) {
                utils.play_animation(scene, 'explosion', img.x + 8, img.y + 8);
                img.destroy();
            }
            this.visible = this.visible.slice(0, 1);
            this.visible[0].setPosition(this.offsetX, this.offsetY + 7 * 32);
        }

        else {
            utils.play_animation(scene, 'explosion', this.offsetX + 8, this.offsetY + 6 * 32 + 8);
        }

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
                if (tower[i].check_color(tower[i + 1])) {
                    score += 2;
                }
            }

            // triple color -> sum 3x3 points - 3x1 base points - 2x2 extra from double bonus = 9 - 3 - 4 pts = 2 pts
            if (tower.length > 2) {
                for(var i = 0; i < tower.length - 2; i+=2) {
                    if (tower[i].check_color(tower[i + 1]) && tower[i + 1].check_color(tower[i + 2])) {
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

        this.active_effects = [];
    }

}
