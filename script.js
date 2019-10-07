
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
            <div onclick = loadPrograms(${channel.id})>
                <h5>${channel.name}</h5>
                <img src = "${channel.image}">
            </div>
        `;

    });

    document.getElementsByClassName("content")[0].innerHTML=html.join("");


}


async function loadPrograms(id)
{
    const url = `http://api.sr.se/api/v2/programs/index?channelid=${id}&format=json&pagination=false`;
    const data = await fetch(url);
    const programs = (await data.json()).programs;
    console.table(programs);
    printPrograms(programs);
}

function printPrograms(programs){

    let html = programs.map(program=>{

        return `
            <div>
                <h5>${program.name}</h5>
                <p>${program.description}</p>
            </div>
        `;

    });

    document.getElementsByClassName("content")[1].innerHTML=html.join("");


}