class PuzzleTower extends Phaser.Scene {

    constructor() {
        super({key: "PuzzleTower"});
    }

    create(data) {
        this.number_of_players = data.players;
        this.number_of_rounds = data.rounds;
        this.round_number = 1;
        this.round_time = data.round_time;

        console.log(this.number_of_players, 'players are playing for', this.number_of_rounds, 'rounds.');

        // players
        this.players = {}
        for (var i=0; i < this.number_of_players; i++) {
            var name = 'p' + (i + 1).toString();
            // player offset * 100 + player_pos * 200 + offset
            var offsetX = (4 - this.number_of_players) * 100 + (i * 200) + 75;
            this.players[name] = new Player(name=name, offsetX, 120);
        }

        // new shape containers
        this.nexts = {};

        // lands + sky
        this.lands = {};
        this.frame_effects = {};

        // input key container
        this.cursors = {};

        // gamepads
        this.pads = {};
        this.button_A_pressed = {};
        this.button_B_pressed = {};

        // score displays
        this.score_popups = {};
        this.scoreboards = {};

        // countdown
        this.remaining_time = this.round_time;
        this.timer_display = this.add.text(350, 545, '00:' + this.remaining_time.toString(), assets.texts['timer']).setDepth(1);
        this.timer = this.time.addEvent({
            'delay': 1000, // every second
            'repeat': this.round_time + 1,
            'startAt': 0,
            'callback': function(scene) {
                if (scene.remaining_time < 0) {
                    scene.decide_winners();
                }

                var sectext = scene.remaining_time > 9 ? scene.remaining_time.toString() : '0' + scene.remaining_time.toString();
                scene.timer_display.setText('00:' + sectext);
                scene.remaining_time--;
            },
            'args': [this]
        });

        // Init game board
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.esckey = this.input.keyboard.addKey('ESC');

        for (var name in this.players) {
            // shapes + images
            this.players[name].add_shape(this, new Shape(this, this.players[name].offsetX, this.players[name].offsetY + 32 * 7, 0.0));
            this.nexts[name] = new Shape(this, this.players[name].offsetX, this.players[name].offsetY + 32 * 0, 0.0);

            // controls
            this.cursors[name] = this.input.keyboard.addKeys(assets.controls[name]);
            this.button_A_pressed[name] = false;
            this.button_B_pressed[name] = false;

            // PLAYER FRAME
            this.add.image(this.players[name].offsetX - 50,
                           this.players[name].offsetY - 40,
                           'frame_' + name).setOrigin(0, 0);

            // land
            this.lands[name] = this.add.image(this.players[name].offsetX - 50,
                                              this.players[name].offsetY - 40,
                                              'land_0')
                                        .setOrigin(0, 0)
                                        .setDepth(1);

            // frame effects
            this.frame_effects[name] = {};
            for (var effect of ['leader', 'freeze', 'shock', 'ink']) {
                this.frame_effects[name][effect] = this.add.image(this.players[name].offsetX - 50,
                                                                  this.players[name].offsetY - 40,
                                                                  'frame_effect_' + effect)
                                                           .setOrigin(0, 0)
                                                           .setDepth(1)
                                                           .setAlpha(0);
            }

            // name
            this.add.text(this.players[name].offsetX + 10,
                          this.players[name].offsetY - 40,
                          name,
                          assets.texts[name]['board']).setOrigin(0, 0);

            // control
            var drop_text = name != 'p1' ? assets.controls[name]['skip'] : '<'
            var add_text = name != 'p1' ? assets.controls[name]['drop'] : '>'
            this.add.text(this.players[name].offsetX - 13,
                          this.players[name].offsetY + 373,
                          drop_text,
                          assets.texts[name]['controls']).setOrigin(0, 0);
            this.add.text(this.players[name].offsetX + 54,
                          this.players[name].offsetY + 373,
                          add_text,
                          assets.texts[name]['controls']).setOrigin(0, 0);

            // score board
            this.score_popups[name] = this.add.text(this.players[name].offsetX,
                                                    this.players[name].offsetY + 32 * 4.5,
                                                    '',
                                                    assets.texts[name]['popup']);
            this.scoreboards[name] = this.add.text(this.players[name].offsetX + 5,
                                                   this.players[name].offsetY + 32 * 9,
                                                   'score: 0\n wins: 0',
                                                   assets.texts[name]['board']).setOrigin(0.25, 0);
        }

        // QUEUE
        this.add.image(140, 5, 'queue_frame').setOrigin(0, 0);
        this.queue = new Queue(this, 150, 15, 11);

        // display countdown scene
        this.countdown();

        // ENABLE SWIPE CONTROLS IF ONLY 1 PLAYER PLAYS
        this.nextmove = undefined;
        if (this.number_of_players == 1) {
            this.input.on("pointerup", this.endSwipe, this);
        }
    }


    update() {
        if (Phaser.Input.Keyboard.JustDown(this.esckey)) {
            this.scene.start('MainMenu');
        }

        if (this.input.gamepad.total !== 0) {
            this.pads = this.input.gamepad.gamepads;
        }

        // TOUCH CONTROLS FOR P1
        if (this.number_of_players == 1) {
            if (this.nextmove == 'drop') {
                this.drop('p1');
                this.nextmove = undefined;
            }
            else if (this.nextmove == 'skip') {
                this.skip('p1')
                this.nextmove = undefined;
            }
        }


        // get leaders
        var leaders = utils.get_leaders(this.players);

        for (var name in this.players) {
            // get player stuff
            var cursor = this.cursors[name];
            var playerpad = this.pads[parseInt(name[1]) - 1];

            // player has freeze effect - cannot move
            if (this.players[name].active_effects.indexOf('freeze') > -1) {
                this.frame_effects[name]['freeze'].setAlpha(1);
            }

            // no freeze effect - move freely
            else {
                // remove freeze effect
                this.frame_effects[name]['freeze'].setAlpha(0);

                // show ink effect
                if (this.players[name].active_effects.indexOf('ink') > -1) this.frame_effects[name]['ink'].setAlpha(0.9);
                else this.frame_effects[name]['ink'].setAlpha(0);

                // show shock effect
                if (this.players[name].active_effects.indexOf('shock') > -1) this.frame_effects[name]['shock'].setAlpha(1);
                else this.frame_effects[name]['shock'].setAlpha(0);

                // show leader effect
                if (leaders.includes(name)) this.frame_effects[name]['leader'].setAlpha(1);
                else this.frame_effects[name]['leader'].setAlpha(0);

                // drop command
                if (Phaser.Input.Keyboard.JustDown(cursor.drop) || (playerpad && playerpad.buttons[0].value && (!this.button_A_pressed[name]))) {
                    this.button_A_pressed[name] = true;
                    // if shocked -> reversed control
                    if (this.players[name].active_effects.indexOf('shock') > -1) this.skip(name);
                    else this.drop(name);
                }

                // skip command
                else if (Phaser.Input.Keyboard.JustDown(cursor.skip) || (playerpad && playerpad.buttons[1].value && (!this.button_B_pressed[name]))) {
                    this.button_B_pressed[name] = true;
                    // if shocked -> reversed control
                    if (this.players[name].active_effects.indexOf('shock') > -1) this.drop(name);
                    else this.skip(name);
                }

                if (playerpad && !playerpad.buttons[0].value && (this.button_A_pressed[name]))
                    this.button_A_pressed[name] = false;
                if (playerpad && !playerpad.buttons[1].value && (this.button_B_pressed[name]))
                    this.button_B_pressed[name] = false;
            }
        }
    }


    drop(name) {
        var score_diff = 0;

        // match!
        if (this.players[name].base_shape().check_compatibility(this.nexts[name])) {
            // ANALYTICS
            gtag('event', 'success', {
                'event_category': 'drop',
                'event_label': name,
                'event_value': 1
            });

            // shape movement
            score_diff = this.players[name].add_shape(this, this.nexts[name]);

            // activate effects
            var effect = this.nexts[name].trigger_effect();
            switch(effect) {
                case 'freeze':
                    utils.add_effect(this, effect, 1500, name, this.players);
                    this.sound.play('freeze');
                    break;
                case 'bomb':
                    for (var other in this.players) {
                        if (name != other) {
                            this.players[other].collapse(this);
                            this.sound.play('explosion');
                        }
                    }
                    break;
                case 'shock':
                    utils.add_effect(this, effect, 3000, name, this.players);
                    this.sound.play('shock');
                    break;
                case 'ink':
                    utils.add_effect(this, effect, 2000, name, this.players);
                    this.sound.play('ink');
                    break;
                default: break;
            }

            // next shape generation
            var selected = this.queue.get(this.players[name].offsetX, this.players[name].offsetY + 32 * 0);
            this.nexts[name] = selected;

            // sound
            this.sound.play('ok1');

            // land
            if (this.players[name].tower.length > 15) {
                this.lands[name].destroy();
                this.lands[name] = this.add.image(this.players[name].offsetX - 50,
                                                  this.players[name].offsetY - 40,
                                                  'land_2').setOrigin(0, 0);
            }
            else if (this.players[name].tower.length > 5) {
                this.lands[name].destroy();
                this.lands[name] = this.add.image(this.players[name].offsetX - 50,
                                                  this.players[name].offsetY - 40,
                                                  'land_1').setOrigin(0, 0);
            }
        }

        // mismatch!
        else {
            // ANALYTICS
            gtag('event', 'fail', {
                'event_category': 'drop',
                'event_label': name,
                'event_value': 1
            });
            console.log(name, ' MISS!');
            // remove dropped shape
            this.nexts[name].destroy();
            score_diff = this.players[name].collapse(this);

            // next shape generation
            var selected = this.queue.get(this.players[name].offsetX, this.players[name].offsetY + 32 * 0);
            this.nexts[name] = selected;

            // sound
            this.sound.play('explosion');
        }

        // score update
        if (score_diff != 0) {
            console.log(name, 'SCOREBOARD UPDATE!');
            // scoreboard update
            this.scoreboards[name].setText('score: ' + this.players[name].score + '\n wins: ' + this.players[name].wins);

            // score popup
            var scr_txt = score_diff.toString();
            var score_popup_text = score_diff > 0 ? '+' + scr_txt : scr_txt;
            this.score_popups[name].setText(score_popup_text).setDepth(1);
            this.time.delayedCall(500, function(name) { this.score_popups[name].setText(); }, [name], this);
        }
    }


    skip(name) {
        // visual feedback
        utils.moveTo(this,
                     this.nexts[name],
                     this.nexts[name].x - 128,
                     this.nexts[name].y,
                     100,
                     utils.destroy,
                     [this.nexts[name]]
                     );

        // sound + analytics
        if (this.players[name].base_shape().check_compatibility(this.nexts[name], true)) {
            // ANALYTICS
            gtag('event', 'fail', {
                'event_category': 'skip',
                'event_label': name,
                'event_value': 1
            });

            console.log(name, ' MISS COMP!');
            this.sound.play('error');
        }

        else {
            // ANALYTICS
            gtag('event', 'success', {
                'event_category': 'skip',
                'event_label': name,
                'event_value': 1
            });

            console.log(name, ' GOOD CALL!');
            this.sound.play('ok2');
        }

        // next shape generation
        var selected = this.queue.get(this.players[name].offsetX, this.players[name].offsetY + 32 * 0);
        this.nexts[name] = selected;
    }


    decide_winners() {
        console.log('DECIDING WINNERS');
        this.scene.pause();
        // winner computation
        var winners = utils.get_winners(this.players);
        for (var winner of winners) {
            this.players[winner].wins++;
        }
        if (this.round_number >= this.number_of_rounds) {
            this.scene.start("Results", {'players': this.players});
        }
        else {
            this.scene.launch('RoundUp', {'round_number': this.round_number,
                                        'winners': winners});
        }
        this.round_number++;
        this.reset(this);
    }

    countdown() {
        for (var key in assets.anims) {
            this.anims.remove(key + '_anim');
        }
        this.scene.setVisible(true, 'countdown');
        this.scene.run('countdown', {'countdown': 3});
        this.scene.pause();

    }

    reset(scene) {
        console.log('RESET!');

        // countdown
        scene.remaining_time = scene.round_time;
        scene.timer_display.setText('00:' + scene.remaining_time.toString());
        scene.timer.remove()
        scene.timer = scene.time.addEvent({
            'delay': 1000, // every second
            'repeat': scene.round_time + 1,
            'startAt': 0,
            'callback': function(scene) {
                if (scene.remaining_time < 0) {
                    scene.decide_winners();
                }

                var sectext = scene.remaining_time > 9 ? scene.remaining_time.toString() : '0' + scene.remaining_time.toString();
                scene.timer_display.setText('00:' + sectext);
                scene.remaining_time--;
            },
            'args': [scene]
        })

        // clear nexts
        for (var name in scene.players) {
            scene.nexts[name].destroy();
        }
        scene.nexts = {};

        // reset game board
        for (var name in scene.players) {
            // reset players
            scene.players[name].reset();

            // shapes
            scene.nexts[name] = new Shape(scene, scene.players[name].offsetX, scene.players[name].offsetY + 32 * 0, 0.0);
            scene.players[name].add_shape(scene, new Shape(scene, scene.players[name].offsetX, scene.players[name].offsetY + 32 * 7, 0.0));

            // land
            scene.lands[name].destroy();
            scene.lands[name] = scene.add.image(scene.players[name].offsetX - 50,
                                                scene.players[name].offsetY - 40,
                                                'land_0').setOrigin(0, 0);

            // score board
            scene.scoreboards[name].setText('score: 0\n wins: ' + scene.players[name].wins);
        }
    }


    endSwipe(e) {
        var swipeTime = e.upTime - e.downTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);

        if(swipeMagnitude > 50 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
            if(Math.abs(swipeNormal.y) > Math.abs(swipeNormal.x))
                this.nextmove = 'drop';
            else
                this.nextmove = 'skip';
        }
    }

}
