const scale = {
    test: function(){
        console.log(this.name);
    },
    create: function(){
        this.name = "Malcolm";

        this.test();
    },

    run: function(){
        console.log("Hi", this.name);
    }
};

scale.create();
scale.run();