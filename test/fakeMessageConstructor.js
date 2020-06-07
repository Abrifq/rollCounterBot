/**
 * @constructs
 * @param {{content:string,userID:string}} mimicOptions 
 */
function fakeMessageConstructor ({ content="", userID="" }){
    this.content = content;
    this.member = {id:userID};
    this.channel ={send:async function(msgContent){
        console.log("Sent Message: "+msgContent);
        return {
            edit:async function(msgContent){
                console.log("Edited A message to: "+ msgContent);
                /*
                I don't care, I **don't have to** return it.
                Because at the end, original messages are still valid pointers.
                Thus returning same/another message object won't help.
                */
            }
        };
    }};
}

exports = module.exports = fakeMessageConstructor;
