async function check() {
    console.log("--- 1. Homepage Checks ---");
    let t = await fetch('https://learnpharmacy.in').then(r => r.text());
    console.log('SSR HTML contains <title>?', /<title>/.test(t));
    console.log('SSR HTML contains meta description?', /meta name="description"/.test(t));
    console.log('SSR HTML contains <h1>?', /<h1/.test(t));
    console.log('Is it just an empty <div id="root">? (CSR only)', t.includes('id="root"') && t.length < 5000);
    console.log('Total HTML payload length:', t.length);

    console.log("\n--- 2. Subject Page Checks ---");
    let t2 = await fetch('https://learnpharmacy.in/subjects/pharmacology').then(r => r.text());
    let titleMatch = t2.match(/<title>(.*?)<\/title>/);
    let descMatch = t2.match(/<meta name="description" content="(.*?)"/);
    console.log('Subject Title:', titleMatch ? titleMatch[1] : 'Not Found');
    console.log('Subject Meta Desc Found?', !!descMatch);
    console.log('SSR HTML contains <h1>?', /<h1/.test(t2));
    console.log('Total HTML length:', t2.length);
}
check();
