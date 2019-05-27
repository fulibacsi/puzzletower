// SHAPE RELATED FUNCTIONS

var shape = new function() {

    this.generate = function() {
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

    this.check_compatibility = function(base, next, check_color=false) {
        console.log('B: ' + base + ' N: ' + next + ' = ' + (base[0] == next[1]).toString());
        var compatible = base[0] == next[1];

        if (check_color) {
            compatible = compatible && shape.check_color(base, next);
        }

        return compatible;
    }

    this.check_color = function(base, next) {
        return base[3] == next[3];
    }
}
