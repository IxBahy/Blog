---
layout: ../../layouts/ArticleLayout.astro
title: Level Up Your FastAPI, Exception Handling Done Right
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
strong ,b {
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




In FastAPI applications, managing exceptions effectively is crucial for creating robust and maintainable APIs. This guide will delve into organizing exception handlers, with a strong focus on leveraging default behaviors and implementing custom error-handling strategies. Let's break it down step by step, starting from how to handle exceptions in Python.

## Error Handling Approaches

In coding, there are two general handling approaches. Each is more common in some languages than others, and we will discuss both here.

### 1. Look Before You Leap (LBYL)

This approach uses conditional statements to validate whether the next action will cause any error. While not so popular with Python, it's more common in languages with a type system like TypeScript. You'll frequently find multiple type guards in codebases before performing actions like accessing a property.

#### Example 1.1
```typescript
        type ApiRequest = {
        data: {
            user: {
                name?: string;
            };
            };
        };

        function fetchApiRequest(): ApiRequest {
        return { data: { user: { name: "John Doe" } } };
        }

        // Should be more complex here :p
        function isString(value: any): value is string {
        return typeof value === 'string';
        }

        function isDataPresent(request: ApiRequest): request is { data: { user?: { name?: string } } } {
        return !!request.data;
        }

        function isUserPresent(data: { user?: { name?: string } }): data is { user: { name?: string } } {
        return !!data.user;
        }

        function guard_request(request): bool {
        if (!isDataPresent(request)) {
            throw new Error("Data not available");
        }
        if (!isUserPresent(request.data)) {
            throw new Error("User not available");
        }
        if (!isString(request.data.user.name)) {
            throw new Error("Name is not a string");
        }
        return true;
        }

        // <!-- Actual Logic -->
        const request = fetchApiRequest();
        guard_request(request);
        const userName = request.data.user.name;
        const processedName = userName.trim().toUpperCase();

        return `Hello, ${processedName}!`;
```

While this example may seem simplistic, it demonstrates how this approach helps ensure that the object holding the name attribute is present. (Although we could replace the whole thing using optional chaining `request.data?.user?.name`, this example is for explanation purposes.)

The challenge with this approach is that it's not always clear what we need to check, and for new scenarios, you might forget one or two checks. However, the benefit is that it keeps the error checking logic separate from the core function logic, resulting in cleaner code since you can group all code checking into a separate function.

As mentioned earlier, this approach is not considered "Pythonic."

### 2. Easier to Ask for Forgiveness than Permission (EAFP)

If checking first whether we can do something means asking for permission, then doing it wrong leads us to asking for forgiveness. This should sound familiar—it's the usual try-except blocks where you attempt something and handle any errors in the except block.

As Pythonic as this approach is, I personally don't prefer it since we often end up adding a catch-all except and pass or log statement, causing redundant code. Additionally, if you raise a specific error in an inner function without handling it specifically, and then at some outer level catch all errors to raise a 500 server error, you make the process of creating meaningful errors harder and may sometimes send incorrect messages or error codes.

#### Example 1.2
Here's the same code rewritten in Python using the EAFP approach:

```python
            class ApiRequest:
                def __init__(self, data=None):
                    self.data = data

            def fetch_api_request() -> ApiRequest:
                return ApiRequest(data={'user': {'name': 'John Doe'}})

            try:
                request = fetch_api_request()
                user_name = request.data['user']['name']
                processed_name = user_name.strip().upper()

                return f"Hello, {processed_name}!"

            except KeyError as e:
                raise CustomKeyException(f"Error: Missing Key in the Request - {HTTPStatus.NOT_FOUND}") # which key?

            except TypeError as e:
                raise CustomTypeException(f"Wrong Type was sent in the request - {HTTPStatus.BAD_REQUEST}")  # which value was wrong?

            except Exception as e:
                raise ServerException(f"Error: {str(e)} - {HTTPStatus.INTERNAL_SERVER_ERROR}")  # Hmmm
```

As you can see, we're catching exceptions and raising new ones with more meaningful messages and status codes. However, the problem is that we're not sure what caused the error, and they could be caught in the wrong place only to be overwritten again and again unnecessarily. The code is also more complex and harder to read and maintain since the logic is hidden inside try-except blocks. Imagine if you needed to recover from the exception and the code inside the exception block required its own try-except blocks pure pain!

### So What Should We Do?

The best approach is to use a mix of both strategies. In the function you're invoking, handle all known possible errors and raise a custom exception that inherits from a custom base exception class for that type of exception. Then, in the outer function, don't try to catch anything and let it bubble up to the main handler, where you'll catch all exceptions, log them, and handle them appropriately based on whether they're recoverable or not.

This way, you can maintain clean and readable code while having a clear view of what went wrong, where, and why. Is this a rule to follow blindly? Certainly not—if your route is so simple that creating a new function would be just overhead, you should raise the exception in the route since it won't cause problems for readers. The route does one thing and raises an exception if it can't do it.

However, once it gets more complicated, you should start separating the logic into utility functions or client classes to reuse the code and handle exceptions in a single place, benefiting from consistency in responses if the same problem occurs in different places.

#### Example 1.3
```python
        class ApiRequest:
            def __init__(self, data=None):
                self.data = data

        def fetch_api_request() -> ApiRequest:
            return ApiRequest(data={'user': {'name': 'John Doe'}})

        def process_request(data: Optional[ApiRequest]) -> str:
            # Following the LBYL approach, we cover the cases we know that can happen 
            # and raise a custom exception for each case to better handle it in a higher scope
            if not data:
                raise MissingRequestValueException(keys=['data'], message="Request is missing the data key")
            
            if not data.user:
                raise MissingRequestValueException(keys=['data.user'], message="Request is missing the user key")

            user_name = data.user.get('name', "Anonymous User") # here we handled if there was no name
            processed_name = user_name.strip().upper()
            return f"Hello, {processed_name}!"

        # Our actual logic lies here - clean and readable
        request = fetch_api_request()
        result = process_request(request.get('data', None))

        # And in some external handlers, we'll catch the exception and log it and perform 
        # a more suited action regarding the use case internally or externally, 
        # like returning a 500 server error or a 400 bad request
```

## Exception Types

There are two types of exceptions you can encounter in your code:
1. Recoverable Exceptions
2. Unrecoverable Exceptions

How do you know which type your exception is? Simple: if your function can continue despite the error or retry the logic to produce the expected results, then it's recoverable. If it needs to stop, then it's unrecoverable. (Note that an unrecoverable error can become recoverable in a higher scope.)

### Recoverable Exceptions
The most common examples of recoverable exceptions are external timeouts or failures where in the exception handler you'll simply retry the same operation. Also included are logical errors that can be fixed by the user, such as sending an incorrect date format or wrong value, type, or format in a field that can be fixed using default values.

### Unrecoverable Exceptions
The most common examples of unrecoverable exceptions are internal server errors that can't be fixed, such as API call failures, database connection failures, or missing files. In these cases, you try to log what caused the exception, then stop execution and return a 500 server error to the user or take other appropriate action based on your application's needs.

## Structuring Exception Handlers in FastAPI Applications

First, we must understand FastAPI's default behaviors before taking any action. Always remember: if you have 4 hours to cut a tree, spend 3 hours sharpening the axe.

So what can FastAPI provide out of the box? There are three main handlers we must understand: the Request Error handler, Response Error handler, and the HTTP Status Code handler.

1. **RequestValidationError**: This handler catches the exception and returns a 400 Bad Request response with the error details in JSON format (which I personally don't prefer).

2. **ResponseValidationError**: If you use Pydantic as a response_model and your returned data doesn't match the schema, it raises a ResponseValidationError. This is handled in the request-response lifecycle and is classified as a server-side error, returning Internal Server Error with status code 500. It will appear in your logs, and the user won't see any sensitive or useless data.

3. **HTTPException**: FastAPI will handle common HTTP status codes for you (404, 500, 401, 403, 400, etc.). Internally, it simply checks for the raised status code and returns the response with the status code and the body you provided in the exception if it's in a pre-specified set, or just the code if not.

```python
        async def http_exception_handler(request: Request, exc: HTTPException) -> Response:
            # Simple, right?
            headers = getattr(exc, "headers", None)
            if not is_body_allowed_for_status_code(exc.status_code):
                return Response(status_code=exc.status_code, headers=headers)
            return JSONResponse(
                {"detail": exc.detail}, status_code=exc.status_code, headers=headers
            )
```

Simple and effective, right? It can work as the second generic handler after **Exception**, but it's still not perfect. We should understand how to reuse it rather than building a whole new handler from scratch.

### Note
Before diving into the technical part (I know you're here for it, but bear with me), you should know that the most important aspect of handling exceptions is understanding where these exceptions come from in your code. Please avoid spamming `raise HTTPException` everywhere. Ensure that your handlers return responses with the correct status codes, messages, and headers when needed, rather than just returning a 500 server error with a generic message or raising an HTTPException inside it again to be handled in the outer handler.

## Raising Exceptions in FastAPI

Before discussing how to handle exceptions, we should know what we're handling and where we should raise our own exceptions. The exception types that come to mind are:

- Request Validation
- Response Validation
- Connection Errors
- Timeout Errors
- Database Errors
- Authorization Errors
- Authentication Errors
- Custom Errors (depending on your project and business logic)

Most of these errors will be raised automatically by the packages you use, so I'll focus more on the ones we will raise.

### Where Should We Raise the Exception?

Surely not in the route—but where then? You should look to the closest line of code that might trigger this exception and do the raising there. As in the `process_request` function in Example 1.3, I did the raising there. You should aim for clean API routes without nested exceptions so that reading the code doesn't become an eye exercise.

Is this a rule you should follow blindly? Certainly not. If your route is so simple that creating a new function would be just overhead, you should raise the exception in the route since it's simple anyway. This won't cause problems for readers—the route does one thing and raises the exception if it can't do it.

However, once it gets more complicated, you should start separating the logic into utility functions or client classes to reuse the code and handle exceptions in a single place, benefiting from consistency in responses if the same problem occurs in different places.

#### Example 2.1
```python
        # utils.py
        import httpx
        from sqlalchemy.orm import Session
        from models import Item
        from time import sleep

        def process_request(db: Session, item_id: int, token: str):
            """
            Fetch an item from the database. Raise an exception if not found.
            """
            item = db.query(Item).filter(Item.id == item_id).first()
            if not item:
                raise NotFoundException(exc=e, model=Item, id=item_id, token=token)
            return item

        def fetch_data_from_service(service_url: str, retries: int = 3, delay: int = 2):
            """
            Fetch data from an external service with retry logic for connection and timeout errors.
            """
            for attempt in range(retries):
                try:
                    response = httpx.get(service_url, timeout=5)
                    response.raise_for_status()
                    return response.json()
                except (httpx.ConnectError, httpx.TimeoutException) as e:  # The except here is just for retries
                    if attempt < retries - 1:
                        sleep(delay)
                    else:
                        raise ExternalServiceUnavailableException(exc=e, service_url=service_url)
                except httpx.HTTPStatusError as e:
                    raise ExternalServiceStatusException(exc=e, service_url=service_url, status_code=e.response.status_code)
```

For the route itself:

```python
        from fastapi import FastAPI, Depends, HTTPException
        from sqlalchemy.orm import Session
        from database import get_db
        from utils import process_request, fetch_data_from_service

        app = FastAPI()

        SERVICE_URL = "https://api.example.com/data"

        @app.get("/items/{item_id}")
        def get_item(item_id: int, db: Session = Depends(get_db), token: str = Depends(get_token)):
            item = process_request(db, item_id, token)
            external_data = fetch_data_from_service(SERVICE_URL)

            return {
                "id": item.id,
                "name": item.name,
                "external_data": external_data
            }
```
### How to Write Exception Classes

Each category of exceptions should have its own base class, and there will be one base for all the other classes which will act like an interface. This interface specifies that certain properties must exist, or the code won't compile (raise unimplemented error). 

For my implementation, I like my interface to abstract two functions:
1. One to form the message passed to the exception class 
2. Another to form the trace that will be passed to the logger 

#### Example 2.2
```python
        from abc import ABC, abstractmethod
        class BaseCustomException(ABC):
            """
            Base interface for all custom exception classes.
            Ensures that derived exceptions implement specific methods.
            """
            status_code: int = 500

            @property
            @abstractmethod
            def message(self) -> str:
                """
                Abstract property to provide a formatted message.
                """
                pass
            
            @property
            @abstractmethod
            def trace(self) -> str:
                """
                Abstract property to provide a formatted trace for logging.
                """
                pass


        class CustomException(BaseCustomException, Exception):
            """
            Example of a custom exception inheriting from the interface.
            """
            def __init__(self, key: str, location: str, exc: Exception = None):
                self.key = key
                self.location = location
                self.exc = exc
                # any data you need 
                
            @property
            def message(self) -> str:
                """
                Formatted Exception message.
                """
                return f"Error in {self.key} for any reason"

            @property
            def trace(self) -> str:
                """
                Formatted Exception trace for logging.
                """
                return f"exception raised in {self.location} for " + (f"Trace: {self.exc}" if self.exc else "No trace available")
```

## Handling Exceptions in FastAPI

Now that we have our exceptions ready and we know where to raise them and how to write them, we should learn how to handle them. If you've followed this article and checked all the boxes, handling will be a piece of cake. You have two approaches to handle exceptions:

Define a handling function for each exception type and associate it like this:

```python
app.add_exception_handler(CustomException, CustomHandlerFunction)
```

However, I personally don't prefer this approach. Instead, we might create a Client class to handle all exceptions that inherit from our base class. After all, what's left now? Just returning a good response and logging the trace, focusing on making both meaningful and adding i18n to responses if needed.

Let's start by making a base client:

```python
        # my_app/exceptions/handler.py

        import logging
        from fastapi import Request
        from fastapi.responses import JSONResponse

        class ExceptionHandlerClient:
            def __init__(self, logger: logging.Logger = None):
                """
                Initializes the ExceptionHandlerClient.

                Args:
                    logger (logging.Logger): Optional logger instance. If not provided, a default logger is created.
                """
                self.logger = logger or logging.getLogger(__name__) 
                self._setup_default_logger()

            def _setup_default_logger(self):
                """Sets up a default logger if none is provided."""
                if not self.logger.handlers:
                    handler = logging.StreamHandler()
                    formatter = logging.Formatter(
                        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
                    )
                    handler.setFormatter(formatter)
                    self.logger.addHandler(handler)
                    self.logger.setLevel(logging.INFO)

            def __call__(self, request: Request, exception: BaseCustomException) -> JSONResponse:
                """
                Handles the exception and returns a JSONResponse.

                Args:
                    request (Request): The incoming HTTP request.
                    exception (Exception): The exception to handle.

                Returns:
                    JSONResponse: A JSON response containing the exception message.
                """
                self.logger.error(
                    f"Exception occurred while processing request {request.url}: {exception.trace}",
                )
                if isinstance(exception, CustomException):
                    pass
                    # do anything you need here and for Exception specific handling

                return JSONResponse(
                    content={"message": getattr(exception, "message", str(exception))},
                    status_code=exception.status_code,
                )
```

That handles our custom exceptions, but what about the three other exceptions that FastAPI handles by default? You can either handle them in the client (more work but provides a consistent look) or handle them in other functions. I prefer to stick to a single client to handle all exceptions:

```python
        # my_app/exceptions/handler.py

        import logging
        from fastapi import Request, HTTPException
        from fastapi.responses import JSONResponse
        from fastapi.exception_handlers import http_exception_handler
        from fastapi.exceptions import RequestValidationError, ResponseValidationError

        class ExceptionHandlerClient:
            def __init__(self, logger: logging.Logger = None):
                """
                Initializes the ExceptionHandlerClient.

                Args:
                    logger (logging.Logger): Optional logger instance. If not provided, a default logger is created.
                """
                self.logger = logger or logging.getLogger(__name__) 
                self._setup_default_logger()

            def _setup_default_logger(self):
                """Sets up a default logger if none is provided."""
                if not self.logger.handlers:
                    handler = logging.StreamHandler()
                    formatter = logging.Formatter(
                        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
                    )
                    handler.setFormatter(formatter)
                    self.logger.addHandler(handler)
                    self.logger.setLevel(logging.INFO)

            def __call__(self, request: Request, exception: BaseCustomException) -> JSONResponse:
                """
                Handles the exception and returns a JSONResponse.

                Args:
                    request (Request): The incoming HTTP request.
                    exception (Exception): The exception to handle.

                Returns:
                    JSONResponse: A JSON response containing the exception message.
                """
                message = getattr(exception, "message", str(exception))
                status_code = exception.status_code
                
                self.logger.error(
                    f"Exception occurred while processing request {request.url}: {exception.trace}",
                )
                
                if isinstance(exception, HTTPException):
                    return await http_exception_handler(request, exc)
                if isinstance(exception, RequestValidationError):
                    message = f'Format a message you want from the pydantic error returned'
                    status_code = 400
                if isinstance(exception, ResponseValidationError):
                    message = f'Format a message you want from the pydantic error returned'
                    status_code = 500

                return JSONResponse(
                    content={"message": message},
                    status_code=status_code,
                )
```

See how we handled the default exceptions in the client and returned the response with the correct status code and message, making use of FastAPI's default handlers? 

I hope you enjoyed this article. See you next time!