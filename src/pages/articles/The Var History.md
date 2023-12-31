---
layout: ../../layouts/ArticleLayout.astro
title: The Var History
---


<style>
p{
		font-size:16px;
}
img{
	margin:0 auto;
}
h1{
	font-size:3.2rem;
}
h2{
	font-size:2.5rem;
}
h3{
	font-size:2.2rem;
}
h4{
	font-size:1.8rem;
}
h5{
	font-size:1.5rem;
}
strong, b {
	font-size:1.8rem;
	font-weight:bold;
}
ul{
	list-style: disc;
}
li{
	font-size:1.5rem;
}

</style>

# The Var keyword

<br/>

Var and let might do almost the same job but under the hood var is a different breed

variables declared with var, are either function-scoped or global-scoped. They are visible through blocks => no block scope. and they are always hoisted and tolerate redeclaration ' That's the difference in a nutshell '

<br/>

- a block scope means the scope in the if conditions and the loops

<br/>

```js

		if (true) {
			var test = true; // if statement is a block and it should have a lexical environment 'modern JS feature'
			//But the var break this rule
		}
		console.log(test); // true, the variable lives after if. it should be undefined


```

<br/>

note: If a code block is inside a function, then var becomes a function-level variable:

<br/>

- it's hoisted but what does it really mean

hoisted => raised so for example if we will assign a value to a variable that we declared with var at the first line of our code but the declaration is far down this normally should cause an error but it won't So this code:

<br/>

```js

		function anything() {
			variable = "Hello"; // this should give an error => refrence error cant access before init but it works

			console.log(variable);

			var variable;
		}

		anything();


```
<br/>

…Is technically the same as this (moved var phrase above):

<br/>

```js

		function anything() {
			var phrase;

			phrase = "Hello";

			console.log(phrase);
		}
		anything();


```
<br/>

note: declaration is hoisted but the assignment is not so if we declare a variable and assigned it below but referenced it above it will run because the declaration is raised but it won't be assigned any value so it will run but the variable will equal null

<br/>

- With var, we can redeclare a variable any number of times. If we use var with an already-declared variable, it’s just ignored:

<br/>

```js

		var user = "Pete";

		var user = "John"; // this "var" does nothing (already declared) // ...it doesn't trigger an error

		console.log(user); // John


```

<br/>

## So how did they manage to work around this in the old days ' IIFE '

<br/>

first before even saying how they managed to avoid the var why did they really want to avoid it? what did it cause

### Global namespace pollution

<br/>

- first we have to talk about something you didn't even know before JAVASCRIPT HAS A GARBAGE COLLECTOR tho it might seem obvious but probably not a lot of people read about it why? because memory management in JavaScript is performed automatically and invisibly to us have you ever asked What happens when something is not needed anymore? How does the JavaScript engine discover it and clean it up?

<br/>

**reachability** In a nutshell it means that all the variables we can currently reach and use will be put in the memory the others are discarded

<br/>

values:

<br/>

- root values: -The currently executing function, its local variables and parameters. -Other functions on the current chain of nested calls 'event loop', their local variables and parameters. -Global variables. -(there are some other, internal ones as well)

<br/>

- reachable values: Any other value is considered reachable if it’s reachable from a root by a reference or by a chain of references.

-unreachable: removed from memory by the garbage collector

<br/>

**Example**

```js

		let object = {
			value: "hi", //now the object is in the stack and it references the value stored in the heap
		};
		//this now is a reachable value (some address in the stack that references the value in the heap )


```

<br/>

but if we do this in the same code

<br/>

```js

		object = null;
		//the address in the stack is now deleted and the value in the heap has nothing that points to it => unreachable
		//and here is where our friend Garbage Collector works and junks it to free the memory


```

<br/>

if the references are interlinked more details here: https://javascript.info/garbage-collection#interlinked-objects

and you remove the root object that points to all the values the removed values are called **Unreachable island**

<br/>

**digging deeper into the GC** the internal algorithm: it's called 'mark-and-sweep' at it works as follows:

<br/>

- The garbage collector takes the global object as a root and “marks” all the references from it.

<br/>

- then it considers each mark a new root and marks all the references from it 'will look like a tree'

<br/>

- And so on until every reachable (from the roots) reference is visited.

<br/>

- All objects except marked ones are removed.

<br/>

the JS engine applies some optimizations to this algorithm:

<br/>

- Generational collection: objects are split into two sets “new ones” and “old ones”. In typical code, many objects have ashort life span: they appear, do their job and die fast, so it makes sense to track new objects and clear the memory fromthem if that’s the case. Those that survive for long enough, become “old” and are examined less often.

<br/>

- Incremental collection: marking the whole object set at once, it may take some time and introduce visible delays in theexecution the engine splits the whole set of existing objects into multiple parts and then clears these parts one afteranother There are many small garbage collections instead of a total one. That requires some extra bookkeeping between them totrack changes, but we get many tiny delays instead of a big one.

<br/>

- Idle-time collection: the garbage collector tries to run only while the CPU is idle, to reduce the possible effect on theexecution.


<br/>

### Back to global namespace pollution


<br/>

As variables lose scope, they will be eligible for garbage collection. If they are scoped globally, then they will not be eligible for collection until the global namespace loses scope, and trust me you don't want to have a lot of global scope variables.

<br/>

a code like this one

<br/>

```js

		for (var i = 0; i < 2003000; i++) {
			var arra = [];
			arr.push(i * i + i);
		}


```

<br/>

will add about 10,000 kb of memory usage that will not be collected and yes we used a var here so why is the var wrong? you might encounter some cases when you define variables in a block scope 'if statement or a loop' but in the old days it will be scoped in the global namespace

<br/>

but if it was like this

<br/>

```js

		for (let i = 0; i < 2003000; i++) {
			let arra = [];
			arr.push(i * i + i);
		}


```

<br/>


it would've been collected as soon as it exited the for-loop scope


<br/>

**Always remember** keeping the values in a closure will ensure they are collected don't know what closure is don't worry we will talk about it another time


<br/>

### So how did they manage to avoid this ' IIFE '

<br/>

**IIFE** => immediately-invoked function expressions it's not something you should use but you have to know that you can do this an IIFE is


<br/>

```js

		(function () {
			var something = "idk";
			console.log(something);
		})(); //here it invoked as soon as it was created and we use it in this function context to do all what we need and then
		//it's removed from the memory by the GC


```

<br/>

Question 1: why is it wrapped in parenthesis?

<br/>

- Javascript engine when encountering the keyword "function" understand that this is a declaration and thus it needs a name so our code above will cause an error -> SyntaxError: Function statements require a function name

<br/>

Question 2: why don't we add a name?

<br/>

- Javascript doesn't allow the function declaration to be called immediately

there are other ways to do this in JS it doesn't have to be a parenthesis

<br/>

our history lesson now is done :)
