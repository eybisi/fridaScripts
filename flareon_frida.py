##http://eybisi.run/2018/10/06/Flareon5-6-Challenge-Magic

from __future__ import print_function
import frida
import sys
from itertools import product
#inds isng  llg w. e  HthitheoftheAh,urnolik inefe  yo blrhot in owace
#abcdefghijklmnopqrstuvwxyz., ABCDEFGHIJKLMNOPQRSTUVWXYZ
#abcdefghilnorstuwy.,AH   


session = frida.attach("magic")
script = session.create_script("""
pool2 = ['e ',' H','is','no','of',' g','bl','ow','ur',' w','in','yo'] 
pool3 = ["ds ","hot","the",' yo',"ace","thi",'Ah,',' in',' bl','lik']
pool = 'abcdefghilnorstuwy.,AH '
s=[]

var xor = new NativeFunction(ptr(0x402CDF), 'void', ['pointer','pointer','pointer']);

function toHex(str,hex){
  
  str = str.split("").reverse().join("");
  hex = unescape(encodeURIComponent(str))
    .split('').map(function(v){
      return v.charCodeAt(0).toString(16)
    }).join('')
  stri = '0x'+hex

  return parseInt(stri)
}

var remaining = 667;
function crackNext() {



		c = 0
		sol = "                                                                     "
		for(l =0;l<33;l++){
			base = 0x605100+(0x120*l)
			s[l*5] =  Memory.readS32(ptr(base+0x8))
			s[l*5+1] = Memory.readS32(ptr(base+0xc))
			s[l*5+2] = Memory.readS32(ptr(base+0x10))
			s[l*5+3] = Memory.readS32(ptr(base))
		 	s[l*5+4] = Memory.readS32(ptr(base+0x18))
		 }
	  for(var i =0;i<s.length/5;i++)
			{

				xor(ptr(s[i*5+3]),ptr(s[i*5]),ptr(s[i*5+4]))
			}
		possible = []
		for(var i=0;i<s.length/5;i++)
		{
			pool_l = []
			len = s[i*5+2]
			if(len == 1) pool_l = pool
			else if(len == 2) pool_l = pool2
			else if(len == 3) pool_l = pool3
			else pool_l = pool
			found = false
			var fnc1 = new NativeFunction(ptr(s[i*5+3]), 'int', ['pointer','pointer','pointer']);	

			for(var j = 0;j<pool_l.length;j++)
				{
			
				Memory.writeS32(ptr(0x400000),toHex(pool_l[j]))
				t = Memory.readS32(ptr(0x400000),len)
				b = 0x605120+(0x120*i)
				fnc_r = fnc1(ptr(0x400000),ptr(len),ptr(b))
					if (fnc_r == 1){

						sol = [sol.slice(0,s[i*5+1]),pool_l[j],sol.slice(s[i*5+1]+len)].join('');
						sol[i*5+1] = pool_l[j]
						found = true
						break
					}
				}

			if(!found){
				if(len==3){
					sol = [sol.slice(0,s[i*5+1]),"ng ",sol.slice(s[i*5+1]+len)].join('');
						
				}
				else{
					sol = [sol.slice(0,s[i*5+1]),"ll",sol.slice(s[i*5+1]+len)].join('');
					
				}
			}
			
		}
		console.log(sol)

		for(var i =0;i<s.length/5;i++)
		{
			//console.log(i*5+3)
			xor(ptr(s[i*5+3]),ptr(s[i*5]),ptr(s[i*5+4]))
		}
  if (--remaining > 0) {
    setTimeout(crackNext,70);
  }
}
setTimeout(crackNext, 0);




""")
def on_message(message, data):
    print(message)
script.on('message', on_message)
script.load()
sys.stdin.read()


