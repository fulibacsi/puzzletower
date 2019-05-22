var utils = new function() {

    this.randint = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    this.get_winners = function(players, score_key='score') {
        var scores = {};
        for (var name in players) {
            scores[name] = players[name][score_key];
        }
        var max_score = Math.max(...Object.values(scores));
        var winners = [];
        for (var name in players) {
            if (scores[name] == max_score) {
                winners.push(name);
            }
        }
        return winners;
    }

    this.moveTo = function(scene, obj, x, y, time=600, animation) {
        var delay;
        var steps;
        if (time < 60) {
            steps = time;
            delay = 1;
        } else {
            delay = Math.round(time / 60);
            steps = 60;
        }

        dx = (x - obj.x) / steps;
        dy = (y - obj.y) / steps;

        console.log('START (', obj.x, ',', obj.y, '); END (', x, ',', y, ')');
        console.log('delay:', delay, 'steps:', steps, ', dx:', dx, ', dy:', dy);
        console.log('Expected END (', obj.x + dx*60, ',', obj.y + dy*60, ')');

        var timer = scene.time.addEvent({
            delay: delay,
            callback: utils.step,
            repeat: steps,
            args: [obj, x, y, dx, dy]
        });

        if ((animation !== undefined) && (animation !== null)) {
            scene.time.addEvent({
                delay: time,
                callback: utils.play_animation,
                repeat: 0,
                args: [scene, animation, x, y]
            });
        }
    }

    this.step = function(obj, x, y, dx, dy) {
        var newx = obj.x < x ? Math.min(x, obj.x + dx): Math.max(x, obj.x + dx);
        var newy = obj.y < y ? Math.min(y, obj.y + dy): Math.max(y, obj.y + dx);
        obj.setPosition(newx, newy);
    }

    this.play_animation = function(scene, animation, x, y) {
        var anim = scene.add.sprite(x, y, animation).setOrigin(0, 0).setDepth(2);
        scene.anims.create({
            key: animation + '_anim',
            frames: scene.anims.generateFrameNumbers(animation),
            frameRate: 60,
            repeat: 0
        });
        anim.play(animation + '_anim',);
    }
};
