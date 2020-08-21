import { Kerdx } from 'https://kade-95.github.io/kerdx/index.js';
import { data } from './data.js';

window.kerdx = new Kerdx();
let smallScreen = window.matchMedia("(min-width: 700px)");

let appTitle = kerdx.createElement({
    element: 'span', attributes: { id: 'app-title' }, children: [
        { element: 'span', attributes: { class: 'app-title-dot', style: { backgroundColor: '#6FCF97' } } },
        { element: 'span', attributes: { class: 'app-title-dot', style: { backgroundColor: '#F2994A' } } },
        { element: 'a', attributes: { id: 'app-title-text' }, text: 'howmuchisdata?' }
    ]
});

let searchArea = kerdx.createElement({
    element: 'div', attributes: { id: 'search-area' }, children: [
        { element: 'i', attributes: { class: 'fas fa-search' } },
        { element: 'input', attributes: { id: 'search-box', placeholder: 'Start typing to see results' } }
    ]
});

let dataTable = kerdx.createTable({ title: 'Search result', contents: data })

document.addEventListener('DOMContentLoaded', event => {
    let main = document.body.makeElement({ element: 'main', attributes: { id: 'main-window' } });
    main.makeElement([appTitle, searchArea, dataTable]);

    search();
    monitorSize();
    setTable();
});
let firstCells = dataTable.find('.kerdx-table-column').findAll('.kerdx-table-column-cell');
let duration = dataTable.find(`.kerdx-table-column[data-name="Duration"]`);
let speed = dataTable.find(`.kerdx-table-column[data-name="Avg Speed(Mbps)"]`).find('.kerdx-table-column-title-text');
let rows = [];
for (let i = 0; i < firstCells.length; i++) {
    rows.push(firstCells[i].dataset.row);
}

function search() {
    let searchBox = document.body.find('#search-box');
    let tableRow;
    searchBox.onChanged(value => {
        for (let i = 0; i < rows.length; i++) {
            let hide = false;
            tableRow = dataTable.findAll(`.kerdx-table-column-cell[data-row="${i}"]`);

            for (let j = 0; j < tableRow.length; j++) {
                tableRow[j].cssRemove(['display']);
            }

            if (hide == false) {
                hide = true;
                for (let j = 0; j < tableRow.length; j++) {
                    if (tableRow[j].textContent.toLowerCase().includes(value.toLowerCase())) {
                        hide = false;
                        break;
                    }
                }
            }

            if (hide) {
                for (let j = 0; j < tableRow.length; j++) {
                    tableRow[j].css({ display: 'none' });
                }
            }
        }
    });
}

function setTable() {
    if (!smallScreen.matches) {
        duration.css({ display: 'none' });
        dataTable.find('.kerdx-table').css({ gridTemplateColumns: 'repeat(4, 1fr)' });
        speed.textContent = 'Mbps Dn/Up';
    }
    else {
        duration.cssRemove(['display']);
        dataTable.find('.kerdx-table').css({ gridTemplateColumns: 'repeat(5, 1fr)' });
        speed.textContent = 'Avg Speed(Mbps)';
    }
}

function monitorSize() {
    window.onresize = ()=>{
        setTable();
    }
}