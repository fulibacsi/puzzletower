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

};
