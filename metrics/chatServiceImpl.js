const chatServiceImpl = {};

//unary
chatServiceImpl.sendChat = async(request) => {
    try {
        const response = {name: 'miri', message: 'goodbye world'};
        return response;
    } catch(err) {
        console.log(`error sending chat:`, err)
    }
}

chatServiceImpl.sendMultipleChat = async(request) => {
    try {
        for await(const item of request) {
            console.log(item)
        }
        const response = {name: 'kenny', message: 'meow'}
    } catch (err) {
        console.log('error sending chat:', err)
    }
}

chatServiceImpl.receiveMulltipleChat = async(request) => {
    try {
        const response = {};
        /* 
            make response iterable 
            *Symbol.iterator is a 0 arg function that returns an iterable object 
            *see client side streaming ⬆️ - for of is used to iterate these asynciterables (currently not async as response is hard coded)
            */
        response[Symbol.iterator] = function*() {
            yield {name: 'johnny', message: 'wheee'};
            yield {name: 'patryk', message: 'grpseeeek'};
            yield {name: 'ariel', message: 'techstack!'};
        }
        /*
            console.log(response) -> Object {}
            but!
            for(const items of response) {
                console.log(items)
            } will return:
            {name: 'johnny', message: 'wheee'}
            {name: 'patryk', message: 'grpseeeek'}
            {name: 'ariel', message: 'techstack!'}
        */
        for(let i = 0; i < 10; i++) {
            await delay(context.signal, 1000);
            yield response;
        }
    } catch (err) {
        console.log(`error getting messages: `, err)
    }
}