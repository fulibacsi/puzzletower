class Queue {

    constructor(scene, x, y, size) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.size = size;

        this.queue = [];
        for(var i=0; i < this.size; i++) {
            this.queue.push(this.generate(this.x + i * 48, this.y));
        }
    }

    generate(x, y) {
        return new Shape(this.scene, x, y);
    }

    get(x, y) {
        // get selected shape and move to position
        var selected = this.queue[0];
        utils.moveTo(this.scene, selected, x, y, 3);

        // move queue shapes
        this.queue = this.queue.slice(1);
        for(var i=0; i < this.size - 1; i++) {
            utils.moveTo(this.scene, this.queue[i], this.x + i * 48, this.y, 3);
        }
        // generate new shape to queue
        this.queue.push(this.generate(this.x + (this.size - 1) * 48, this.y))

        return selected;
    }

}
