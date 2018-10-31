
function observeSomething(pattern) {
    var resolver = new ApiResolver('objc');
    var things = resolver.enumerateMatchesSync(pattern);
    things.forEach(function(thing) {
        observeMethod(thing.address, '', thing.name);
    });
}

function observeClass(name) {
    var k = ObjC.classes[name];
    if (!k) {
        return;
    }
    k.$ownMethods.forEach(function(m) {
        observeMethod(k[m].implementation, name, m);
    });
}

function observeMethod(impl, name, m) {
    console.log(name + ' ' + m);
    Interceptor.attach(impl, {
        onEnter: function(a) {
            this.log = [];
            this.log.push('(' + a[0] + ') ' + name + ' ' + m);
            if (m.indexOf(':') !== -1) {
                var params = m.split(':');
                params[0] = params[0].split(' ')[1];
                for (var i = 0; i < params.length - 1; i++) {
                    try {
                        this.log.push(params[i] + ': ' + new ObjC.Object(a[2 + i]).toString());
                    } catch (e) {
                        this.log.push(params[i] + ': ' + a[2 + i].toString());
                    }
                }
            }

            //this.log.push(Thread.backtrace(this.context, Backtracer.ACCURATE)
                //.map(DebugSymbol.fromAddress).join("\n"));
        },

        onLeave: function(r,e) {
            try {
                this.log.push('RET: ' + new ObjC.Object(r).toString() );
            } catch (e) {
                this.log.push('RET: ' + r.toString() );
            }

            console.log(this.log.join('\n') + '\n');
        }
    });
}


observeClass('CBCharacteristic')
//observeClass('CBCentralManager')

 
/*
 * To observe a single class by name:
 *     observeClass('NSString');
 *
 * To dynamically resolve methods to observe (see ApiResolver):
 *     observeSomething('*[* *Password:*]');
 */
