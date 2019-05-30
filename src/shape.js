
class Shape {

    constructor(scene, x, y, effect_chance=0.25) {
        this.scene = scene;

        this.x = x;
        this.y = y;

        this.shape = this.generate();
        this.img = this.scene.add.image(this.x, this.y, this.shape).setOrigin(0, 0);

        this.effect = this.generate_effect(effect_chance);
        if (this.effect !== null) {
            this.effect_icon = this.scene.add.image(this.x, this.y, 'effect_' + this.effect).setOrigin(0, 0);
        }
    }

    generate() {
        var shape_array = ['A', 'F', 'V'];
        var color_array = ['y', 'r', 'p', 'b', 'g'];
        var up = shape_array[utils.randint(0, shape_array.length)];
        var down = shape_array[utils.randint(0, shape_array.length)];
        var color = color_array[utils.randint(0, color_array.length)];

        var generated = up + down + '_' + color;

        // ANALYTICS
        gtag('event', 'shape', {
            'event_category': 'generated',
            'event_label': generated
        });

        return generated;
    }

    generate_effect(effect_chance) {
        var effects = ['freeze', 'bomb', 'shock', 'ink'];
        var effect = null;
        if (Math.random() < effect_chance) {
            effect = effects[utils.randint(0, effects.length)];
        }

        return effect;
    }

    check_compatibility(other, check_color=false) {
        console.log('B: ' + this.shape + ' N: ' + other.shape + ' = ' + (this.shape[0] == other.shape[1]).toString());
        var compatible = this.shape[0] == other.shape[1];

        if (check_color) {
            compatible = compatible && this.check_color(other);
        }

        return compatible;
    }

    check_color(other) {
        return this.shape[3] == other.shape[3];
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.img.setPosition(x, y);
        if (this.effect !== null) {
            this.effect_icon.setPosition(x, y);
        }
    }

    trigger_effect() {
        if (this.effect !== null) {
            this.effect_icon.setAlpha(0.0);
        }

        return this.effect;
    }

    destroy() {
        this.img.destroy();
        if (this.effect !== null) {
            this.effect_icon.destroy();
        }
    }
}
