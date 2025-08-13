import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq } from 'drizzle-orm';

export async function POST(req) {
    try {
        const courses = await db.select().from(coursesTable);

        const targetCourse = courses.find(course => 
            course.courseJson.course.chapters.some(chapter => chapter.chapterName.includes('Advanced Functions and Decorators'))
        );

        if (!targetCourse) {
            return NextResponse.json({ error: 'Target course not found' }, { status: 404 });
        }

        const courseId = targetCourse.cid;
        let courseContent = targetCourse.courseContent;

        const chapterIndex = courseContent.findIndex(content => 
            content.courseData.chapterName.includes('Advanced Functions and Decorators')
        );

        if (chapterIndex === -1) {
            return NextResponse.json({ error: 'Target chapter not found in courseContent' }, { status: 404 });
        }

        // The user's corrected content goes here. This is a simplified example.
        const correctedHTML = `
<h2>Advanced Functions and Decorators</h2><p>This section explores how functions in Python are treated as first-class objects and how this property enables powerful patterns like closures and decorators.</p><h3>Functions as First-Class Objects</h3><p>In Python, functions are first-class citizens. This means they can be:</p><ul><li>Assigned to a variable</li><li>Passed as an argument to another function</li><li>Returned from a function</li></ul><pre><code># 1. Assigning a function to a variable
def greet(name):
    return f'Hello, {name}!'
say_hello = greet
print(say_hello('Alice')) # Output: Hello, Alice!

# 2. Passing a function as an argument
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def calculate(operation, x, y):
    return operation(x, y)

result = calculate(add, 5, 3)
print(f'Calculation result: {result}') # Output: Calculation result: 8
</code></pre><h3>Closures</h3><p>A closure is a nested function that remembers and has access to variables from its enclosing scope, even after the outer function has finished executing.</p><pre><code>def outer_function(text):
    # This is the enclosing scope
    def inner_function():
        # The inner function has access to 'text'
        print(text)
    return inner_function # Return the inner function without calling it

# Create a closure
my_printer = outer_function('Hello from the closure!')

# The outer_function has finished, but the returned inner_function still remembers 'text'
my_printer() # Output: Hello from the closure!
</code></pre><h3>Decorators</h3><p>A decorator is a function that takes another function as an argument, adds some functionality to it (wraps it), and returns the new, enhanced function. It's syntactic sugar for the closure pattern.</p><h4>Basic Decorator Example (Timing a function)</h4><p>Let's create a decorator to measure the execution time of a function.</p><pre><code>import time
import functools

def timer_decorator(func):
    # functools.wraps preserves the original function's metadata (name, docstring, etc.)
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs) # Call the original function
        end_time = time.perf_counter()
        print(f'Function {func.__name__!r} executed in {end_time - start_time:.4f}s')
        return result
    return wrapper

@timer_decorator
def long_running_function(n):
    """A function that takes some time to run."""
    sum = 0
    for i in range(n):
        sum += i
    return sum

# The @timer_decorator syntax is equivalent to:
# long_running_function = timer_decorator(long_running_function)
long_running_function(1000000)

print(long_running_function.__name__) # Output: 'long_running_function' (thanks to @wraps)
</code></pre><h4>Decorators with Arguments</h4><p>To create a decorator that accepts arguments, you need an extra layer of nesting.</p><pre><code>def repeat(num_times):
    def decorator_repeat(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator_repeat

@repeat(num_times=3)
def say_whee():
    print('Whee!')

say_whee()
# Output:
# Whee!
# Whee!
# Whee!
</code></pre>
        `;

        // Assuming the content is the first topic. A more robust solution would find the correct topic.
        courseContent[chapterIndex].courseData.topics[0].content = correctedHTML;

        const result = await db
            .update(coursesTable)
            .set({ courseContent: courseContent })
            .where(eq(coursesTable.cid, courseId))
            .returning({ updatedId: coursesTable.cid });

        return NextResponse.json({ success: true, updatedId: result[0].updatedId });

    } catch (error) {
        console.error('Error in temp-fix:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
