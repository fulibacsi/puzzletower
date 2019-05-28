var utils = new function() {

    this.randint = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    this.get_leaders = function(players) {
        var scores = {};
        for (var name in players) {
            scores[name] = players[name]['score'];
        }

        var max_score = Math.max(...Object.values(scores));
        if (max_score == 0) return [];

        var leaders = [];
        for (var name in players) {
            if (scores[name] == max_score) {
                leaders.push(name);
            }
        }

        return leaders;
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

                // ANALYTICS
                gtag('event', 'roundpoints', {
                    'event_label': name,
                    'event_value': scores[name]
                });
            }
        }
        return winners;
    }

    this.moveTo = function(scene, obj, x, y, time=600, callback, args) {
        var delay;
        var steps;
        if (time < 60) {
            delay = 1;
            steps = time;
        } else {
            delay = Math.round(time / 60);
            steps = 60;
        }

        dx = (x - obj.x) / steps;
        dy = (y - obj.y) / steps;

        // console.log('MOVING OBJ:', obj);
        // console.log('START (', obj.x, ',', obj.y, '); END (', x, ',', y, ')');
        // console.log('delay:', delay, 'steps:', steps, ', dx:', dx, ', dy:', dy);
        // console.log('Expected END (', obj.x + dx*steps, ',', obj.y + dy*steps, ')');

        // moving img
        scene.time.addEvent({
            delay: delay,
            callback: utils.step,
            repeat: steps,
            args: [obj, x, y, dx, dy]
        });

        // add callback
        if ((callback !== undefined) && (callback !== null)) {
            scene.time.addEvent({
                delay: time,
                callback: callback,
                repeat: 0,
                args: args
            });
        }
    }

    this.step = function(obj, x, y, dx, dy) {
        var newx = obj.x + dx;
        if (dx < 0) newx =  Math.max(x, newx);
        else if (dx > 0) newx =  Math.min(x, newx);

        var newy = obj.y + dy;
        if (dy < 0) newy =  Math.max(y, newy);
        else if (dy > 0) newy =  Math.min(y, newy);

        // console.log('OBJ(', obj.x, obj.y, ') + D(', dx, dy, ') = ( ', newx, newy, '), exp:(', x, y, ')');
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
        anim.play(animation + '_anim');
    }

    this.destroy = function(obj) {
        obj.destroy();
    }

};
