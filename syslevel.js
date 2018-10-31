
var name = 0;
Interceptor.attach(Module.findExportByName(null, "remove"), {
    onEnter: function (args) {
        
        
        Java.perform(function () {
            const File = Java.use("java.io.File");
            const FileInputStream = Java.use("java.io.FileInputStream");
            const FileOutputStream = Java.use("java.io.FileOutputStream");
            const ActivityThread = Java.use("android.app.ActivityThread");
            path = Memory.readUtf8String(args[0]);
            // create the input channel
            var f = File.$new(path);
            var fis = FileInputStream.$new(f);
            var inChannel = fis.getChannel();
            // create the output channet
            var application = ActivityThread.currentApplication();
            if (application == null)
                return;
            var context = application.getApplicationContext();
            var fos = context.openFileOutput('deleted_' + path.replace(/\//g,"_"), 0);
            name = name + 1;
            var outChannel = fos.getChannel();
            // transfer the file from the input channel to the output channel
            inChannel.transferTo(0, inChannel.size(), outChannel);
            fis.close();
            fos.close();
        });        
    }
});
