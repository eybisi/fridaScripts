# Frida for Unity, Cocos2d or any native based android games
First of all definitely use [typescript](https://github.com/oleavr/frida-agent-example) autocompletion while writing frida scripts. It helps a lot. 

### Pointer Arithmetics
[NativePointer](https://frida.re/docs/javascript-api/#nativepointer) is a pointer type of frida. You can create NativePointer with NativePointer("0x7fffabc0") or short-hand ptr("0x7fffabc0"). Most of the time function arguments/return values will be pointer and you will be using NativePointer type. 

You can add/sub/and/or/xor to pointer address :
```js
const libmb = ptr("0x7fffabc0")
let libmb_a = libmb.add(0x5) //0x7fffabc5
```
You can read/write from NativePointer.There are several different [functions](https://frida.re/docs/javascript-api/#nativepointer) to do that and you can combine them. Most important ones:
```js
//read
p.readByteArray[0x10],p.readPointer(), p.readInt(), p.readFloat(), p.readCString(), p.readAnsiString()
//write
p.writeInt(0x13), p.writeFloat(0.13), p.writeByteArray[0x13,0x37], p.writePointer(ptr("0x7fffabc0"))
```

Lets say you are playing with class of loginRequest and know the offsets of class members. If you got the instance of class, you can easily read structure:

```js
let loginReqStruct = args[0]
const loginReq = {
    nameptr: loginReqStruct.add(0x11).readCString(),
    uid: loginReqStruct.add(0x28).readInt(),
    country: loginReqStruct.add(0x61).readCString(),
    isguest: loginReqStruct.add(0x48).readCString(), // "1","0"
    isfacebook: loginReqStruct.add(0x78).readByteArray(1),
    secret: loginReqStruct.add(0x58).readPointer().readCString(),
    devicetoken: loginReqStruct.add(0x98).readPointer().readCString()
console.log(JSON.stringify(loginReq))  
};
```

### Finding offset of function:

If your binary have function exports (cocos2d games) you could get function offsets by:
```js
const tostyledstring = Module.getExportByName(libname,'_ZNK4Json5Value14toStyledStringEv')
```
If your binary does not have function exports (unity games) you could get function offsets by:

```js
const libm = Process.getModuleByName("libil2cpp.so");
const libmb = libmodule.base;
const has_enough_chips = libmb.add(0x109474)
```

### Creating function
If you want to call function from library you need to create NativeFunction. First parameter is ptr to function address. Second paramater is return value type, third is array of types that function takes as argument.

If function is exported:
```ts
var login_serialize = NativeFunction(Module.findExportByName("libGameName.so",'_ZNK12LoginRequest9serializeERN4Json5ValueE'), 'int', ["pointer"]);
```

If function is not exported:
```ts
var login_serialize = NativeFunction(libil2cppb.add(0x109474), 'int', ["pointer"]);
```

If you want to intercept function call and change/read/write to function arguments you will be using Interceptor.

```ts
let forceSkipFnc = new NativeFunction(libil2cppb.add(0x006A8490),['void'],['pointer'])
const MeetingHudUpdate = libil2cppb.add(0x006A7AF0);
Interceptor.attach(MeetingHudUpdate, {
    onEnter: function (args) {
        forceSkipFnc(args[0])
        this.p = args[0]
        args[0] = 1337
        args[0] = ptr("0x7fffabc0")
    },
    onLeave: function (retval) {
        retval.replace(1337)
        retval.replace(ptr.add(0x30).readPointer())
    },
});
```

### Usefull snippets:

patch code:

```js
Memory.patchCode(libil2cppb.add(0x6C5B98),8,function(code){
    var armW = new Arm64Writer(code,{pc:libil2cppb.add(0x6C5B98)})
    armW.putLdrRegAddress("x9",ptr("0x41414141"))
    armW.putMovRegReg("x0","x20")
    armW.putBlrReg("x9")
    armW.flush()
})
```
If you want to change/read things after function returns use `this` to store onEnter and change onLeave
```ts
Interceptor.attach(MeetingHudUpdate, {
    onEnter: function (args) {
        this.p = args[0]
    },
    onLeave: function (retval) {
        console.log(this.p.add(0x32).readInt())
    },
});
```
Mem dump : 
```js
console.log(
    hexdump(address, {
        offset: 0,
        length: 200,
        header: true,
        ansi: true,
    })
);
```
Backtrace with symbols:
```js
 console.log(Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n') + '\n');
```
Dump cpu context (registers):
```js
console.log(JSON.stringify(this.context))
```
Change CpuContext (to get arm registers):
```ts
let mycntx = <Arm64CpuContext>this.context
console.log(mycntx.x11)
```
replace function 
```js
Interceptor.replace(ptr(0x400c55), new NativeCallback(function (p,p1,p2,p3,p4,p5,p6) {
	
	console.log(JSON.stringify(this.context))
	return 1
	
}, 'int', ['pointer','pointer','pointer','pointer','pointer','pointer','pointer']));
```
search memory

```js
var ranges = Process.enumerateRanges({protection: 'r--',coalesce:true});
var range;
console.log("start scanning")
function processNext(){
    range = ranges.pop();
    if(!range){
        console.log("done.")
        return;
    }
    Memory.scan(range.base, range.size, "66 72 69 65 6e 64 43 6f 75 6e 74", {
        onMatch: function(address, size){
                //console.log("module base ",address)
                console.log('[+] Pattern found at: ' + address.toString());
                console.log(hexdump(address, {
                  offset: 0,
                  length: 300,
                  header: true,
                  ansi: true
                }));
            }, 
        onError: function(reason){
                console.log('[!] err ',reason);
            }, 
        onComplete: function(){
                processNext();
            }
        });
    processNext();
}
```
