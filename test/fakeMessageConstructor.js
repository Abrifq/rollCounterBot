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
            edit:function(msgContent){
                console.log("Edited A message to: "+ msgContent);
            }
        };
    }};
}

exports = module.exports = fakeMessageConstructor;
