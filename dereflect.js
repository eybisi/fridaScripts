Java.perform(function() {

    var internalClasses = ["android.", "org."];
    var classDef = Java.use('java.lang.Class');
    var classLoaderDef = Java.use('java.lang.ClassLoader');
    var loadClass = classLoaderDef.loadClass.overload('java.lang.String', 'boolean');
    var forName = classDef.forName.overload('java.lang.String', 'boolean', 'java.lang.ClassLoader');
    var reflect = Java.use('java.lang.reflect.Method')
    var member = Java.use('java.lang.reflect.Member')
    var dalvik = Java.use("dalvik.system.DexFile")
    var dalvik2 = Java.use("dalvik.system.DexClassLoader")
    var dalvik3 = Java.use("dalvik.system.PathClassLoader")
    //var dalvik4 = Java.use("dalvik.system.InMemoryDexClassLoader")
    var f = Java.use("java.io.File")
    var url = Java.use("java.net.URL")
    var obj = Java.use("java.lang.Object")
    var fo = Java.use("java.io.FileOutputStream")
    obj.getClass.implementation = function(){
        o = this.getClass()
        return this.getClass()
    }
    reflect.hashCode.implementation = function (){
        //console.log(this.hashCode())
        return this.hashCode()
    }
    member.getName.implementation = function(){
        console.log('Getname -> ' + this.getName())
        return this.getName()
    }
    classDef.getMethods.implementation = function(){
        o = this.getMethods()
        //console.log(o)
        return this.getMethods()
    }
    reflect.invoke.implementatition = function(a,b){
        console.log("invoke catched -> " + a)
        this.invoke(a,b)
    }
    f.$init.overload("java.net.URI").implementation = function(a){
        console.log("URI called")
        this.$init(a)
    }
    f.delete.implementation = function(a){
        console.log("[+] Delete catched =>" +this.getAbsolutePath())
        return true
    }
    fo.$init.overload('java.lang.String').implementation = function(a){
        console.log("[+] Output stream created with the file : " + a)
        return this.$init(a)
    }
    fo.close.implementation = function(){
        console.log("[!] Output stream closed")
        fd = this.getFD()

    }
    dalvik.loadDex.implementation = function(a,b,c){
        console.log("[+] loadDex Catched -> " + a)
        return dalvik.loadDex(a,b,c)
    }
    dalvik2.$init.implementation = function (a,b,c,d) {
        console.log("[+] DexClassLoader Catched -> " + a)
        this.$init(a,b,c,d)
    }
    forName.implementation = function(class_name, flag, class_loader) {
        var isGood = true;
        for (var i = 0; i < internalClasses.length; i++) {
            if (class_name.startsWith(internalClasses[i])) {
                isGood = false;
            }
        }
        if (isGood) {
            console.log("Reflection => forName => " + class_name);
        }
        return forName.call(this, class_name, flag, class_loader);
    }
    loadClass.implementation = function(class_name, resolve) {
        var isGood = true;
        for (var i = 0; i < internalClasses.length; i++) {
            if (class_name.startsWith(internalClasses[i])) {
                isGood = false;
            }
        }
        if (isGood) {
            console.log("Reflection => loadClass => " + class_name);
        }
        return loadClass.call(this, class_name, resolve);
    }
});
