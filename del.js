// install package with adb install package.name
// do not open application
// use -f force option
// frida -U -f package.name -l del.js
Java.perform(function() {

    var f = Java.use("java.io.File")
    f.delete.implementation = function(a){
        console.log("[+] Delete catched =>" +this.getAbsolutePath())
        return true

    }
})
