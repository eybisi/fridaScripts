Java.perform(function() {

    var dalvik = Java.use("dalvik.system.DexFile") 
    var dalvik2 = Java.use("dalvik.system.DexClassLoader")
    dalvik.loadDex.implementation = function(a,b,c){
        console.log("[+] loadDex Catched -> " + a)
        return dalvik.loadDex(a,b,c)
    }
    dalvik2.$init.implementation = function (a,b,c,d) {
        console.log("[+] DexClassLoader Catched -> " + a)
        this.$init(a,b,c,d)
    }

});


    