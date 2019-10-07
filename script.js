

async function getAllChannels()
{
    const url = "http://api.sr.se/api/v2/channels?format=json&pagination=false";

    const data = await fetch(url);
    const channels = (await data.json()).channels;
    console.table(channels);
    printChannels(channels);

}


function printChannels(channels){

    let html = channels.map(channel=>{

        return `
            <div>
                <h5>${channel.name}</h5>
                <img src = "${channel.image}">
            </div>
        `;

    });

    document.getElementsByClassName("content")[1].innerHTML=html.join("");


}