const brokenLinks = (statsLinksArray) => {
    let brokenCounter = 0;
    statsLinksArray.map((statusLink) => {
        if(statusLink.ok === 'fail') {
            brokenCounter ++;
        }
    })
    return brokenCounter;
}

const totalLinks = (statsLinksArray) => {
    let linksCounter = 0;
    statsLinksArray.map((statusLink) => {
        if(statusLink.href) {
            linksCounter++;
        }
    })
    return linksCounter;
}

const uniqueLinks = (statsLinksArray) => {
    const uniqueLinksArray = [];
    statsLinksArray.map((statusLink) => {
        if(!uniqueLinksArray.includes(statusLink.href)) {
            uniqueLinksArray.push(statusLink.href);
        }
    })
    return uniqueLinksArray.length;
}


const simpleStats = (statsLinksArray) => {
    const total = totalLinks(statsLinksArray);
    const unique = uniqueLinks(statsLinksArray);

    return `Total: ${total}\nUnique: ${unique}`;
}

const statsValidate = (statsLinksArray) => {
    const total = totalLinks(statsLinksArray);
    const unique = uniqueLinks(statsLinksArray);
    const broken = brokenLinks(statsLinksArray);

    return `Total: ${total}\nUnique: ${unique}\nBroken: ${broken}`;
}

module.exports = {
    simpleStats,
    statsValidate,
};
