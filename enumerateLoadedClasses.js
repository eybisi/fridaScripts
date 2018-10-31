
setImmediate(function() {

	Java.perform(function () {
			Java.enumerateLoadedClasses({
				onMatch: function(className) {

					if(className.indexOf("ctf.stm")>=0){
						console.log(className)

					}

				},
				onComplete: function(){
					console.log("Done");
				}
			});
	});

	

			Module.enumerateImports("base.odex", {
				onMatch: function(className) {

				if(className.name.indexOf("stm")>=0){
						console.log(className.name)

					}
						//console.log(className.name)

					

				},
				onComplete: function(){
					console.log("Done");
				}
			});
})
