function Artist(name, short_name) {
    this.name = name;
    this.short_name = short_name;

    this.tags = {}

    this.hasTag = function(tag) {
        for(var i in this.tags) {
            if(this.tags[i] === tag) {
                return true;
            }
        }
        return false;
    }
}
