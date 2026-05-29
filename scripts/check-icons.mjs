import fs from 'fs';
import path from 'path';

const technologies = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'technologies.json'), 'utf8'));

function providerUrl(source, value) {
    if (!value) return '';
    if (value.startsWith('/') || value.startsWith('http') || value.startsWith('data:')) return value;
    switch (source) {
        case 'skillicon':
            return `https://skillicons.dev/icons?i=${encodeURIComponent(value)}`;
        case 'devicon':
            return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${value}/${value}-original.svg`;
        case 'custom':
            return value;
    }
}

(async function () {
    for (const tech of technologies) {
        const order = ['skillicon', 'devicon', 'custom'];
        let found = false;
        for (const s of order) {
            const candidate = tech.iconSources?.[s] ?? (tech.source === s ? tech.iconUrl : undefined);
            const url = candidate ? providerUrl(s, candidate) : '';
            if (!url) continue;
            try {
                const res = await fetch(url, { method: 'HEAD' });
                if (res.ok) {
                    console.log(`${tech.id}: ${s} OK -> ${url}`);
                    found = true;
                    break;
                } else {
                    console.log(`${tech.id}: ${s} FAIL ${res.status} -> ${url}`);
                }
            } catch (err) {
                console.log(`${tech.id}: ${s} ERROR -> ${url} : ${err.message}`);
            }
        }
        if (!found) console.log(`${tech.id}: NO ICON FOUND`);
    }
})();
