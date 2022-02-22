main();

function main() {
    const express = require('express');
    const application = express();
    const port = 3000;
    const dataBaseConfig = {
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'desafio'
    };

    const mysql = require('mysql');
    buildData();

    application.get('/', (request, response) => {

        let outputHtml = '<h1>Full Cycle Rocks!</h1>';
        const connection = mysql.createConnection(dataBaseConfig);
        try {
            connection.connect();

            insertRecord();

            connection.query("select * from people p;", (e, people) => {
                if (e) throw e;
                people.forEach(p => {
                    outputHtml += `<p>ID: ${p.id}, Nome: ${p.name}</p>`;
                });
                response.send(outputHtml);
            });
        } finally {
            connection.end();
        }


        function insertRecord() {
            const sqlInsert = "insert into people (name) values ('Paulo')";
            connection.query(sqlInsert);
            console.log('Registro inserido com sucesso!');
        }
    });

    application.listen(port, () => {
        console.log('Rodando na porta ' + port);
    });

    function buildData() {
        const connection = mysql.createConnection(dataBaseConfig);
        try {
            connection.connect();
            const sqlCreateTable = 'create table if not exists people (id int auto_increment primary key, name varchar(50) not null);';
            console.log('tabela criada com sucesso!');
            connection.query(sqlCreateTable);
        } finally {
            connection.end();
        }
    }
}

