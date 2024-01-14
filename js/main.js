$(document).ready(function() {
    
    
    // Carrega o token de acesso e armazena na variável window.AccessToken
    autenticaAAD();
    

    // PRO
    // https://app.powerbi.com/groups/245d381f-3774-4f9e-8161-a01f1e7b42b1/reports/5162db5b-dcbb-4b90-9c98-5609cbaafdac/ReportSection?experience=power-bi
    // https://app.powerbi.com/groups/245d381f-3774-4f9e-8161-a01f1e7b42b1/datasets/f51fbc1b-b5d9-4ad7-9b9e-ea20e8c131e1/details?experience=power-bi

    $("#btnRenderizarPro").click(function(e) {

        // Previne o comportamento padrão do botão
        e.preventDefault();

        // Define os parâmetros para renderização do relatório
        let groupId = '245d381f-3774-4f9e-8161-a01f1e7b42b1';
        let reportId = '5162db5b-dcbb-4b90-9c98-5609cbaafdac';
        let datasetId = 'f51fbc1b-b5d9-4ad7-9b9e-ea20e8c131e1';

        // Renderiza o relatório
        renderizarRelatorio(groupId, datasetId, reportId);

    });



    // Fabric
    // https://app.powerbi.com/groups/70542220-baff-451d-a422-0fe8243ab2a4/reports/7ebb09e8-7990-4b23-8092-1131956459e2/ReportSection?experience=power-bi
    // https://app.powerbi.com/groups/70542220-baff-451d-a422-0fe8243ab2a4/datasets/3fb623b4-977e-4e61-9aa4-4e510e823a3c/details?experience=power-bi

    $("#btnRenderizarFabric").click(function(e) {

        // Previne o comportamento padrão do botão
        e.preventDefault();

        // Define os parâmetros para renderização do relatório
        let groupId = '70542220-baff-451d-a422-0fe8243ab2a4';
        let reportId = '7ebb09e8-7990-4b23-8092-1131956459e2';
        let datasetId = '3fb623b4-977e-4e61-9aa4-4e510e823a3c';

        // Renderiza o relatório
        renderizarRelatorio(groupId, datasetId, reportId);

    });

});



function renderizarRelatorio(groupId, datasetId, reportId) {
    
    // Define o token de acesso
    let AuthToken = window.AccessToken;

    // Recupera o token de acesso ao relatório
    recuperaTokenRelatorio(AuthToken, datasetId, reportId);
    let TokenEmbedded = window.EmbedToken;

    // Renderiza o relatório
    embedPowerBIReport(TokenEmbedded, reportId, groupId);
    
}



function autenticaAAD() {

    // Define os parâmetros para autenticação
    var settings = {
        "async": false,
        "crossDomain": true,
        "url": "http://localhost/embedded/GetAccessToken.php",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",                  
            "Access-Control-Allow-Origin": "*"
        }
    }


    // Habilita o CORS
    $.support.cors = true;


    // Executa a requisição
    $.ajax(settings).done(function (response) {
        
        // Armazena o token de acesso na variável window.AccessToken
        window.AccessToken = response;

        // Retorna o token de acesso
        return response;

    });
    
}


function recuperaTokenRelatorio(AUTH_TOKEN, DATASET_ID, REPORT_ID) {
    
    
    // Define a URL para recuperação do token de acesso ao relatório
    let url = "http://localhost/embedded/GenerateEmbedToken.php?token=" + AUTH_TOKEN + "&datasetId=" + DATASET_ID + "&reportId=" + REPORT_ID;


    // Executa a requisição
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + AUTH_TOKEN
        },
        success: (data) => {

            // Exibe o token de acesso no console
            console.log(data)

            // Armazena o token de acesso ao relatório na variável window.EmbedToken
            window.EmbedToken = data;

        },
        error: (data) => {
            // Exibe o erro no console
            console.log('rr', data)
        }
    });

}


function embedPowerBIReport(EMBED_ACCESS_TOKEN, REPORT_ID, GROUP_ID) {
    
    
    // Define as variáveis para renderização do relatório
    let models = window['powerbi-client'].models;
    let accessToken = EMBED_ACCESS_TOKEN;
    let embedUrl = "https://app.powerbi.com/reportEmbed?reportId=" + REPORT_ID + "&groupId=" + GROUP_ID;
    let permissions = models.Permissions.All;


    // Define as configurações para renderização do relatório
    let config = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: accessToken,
        embedUrl: embedUrl,
        id: REPORT_ID,
        permissions: permissions,
        settings: {
            panes: {
                filters: {
                    visible: false
                },
                pageNavigation: {
                    visible: false
                }
            },
            bars: {
                statusBar: {
                    visible: true
                }
            }
        }
    };


    // Define o container para renderização do relatório
    let embedContainer = $('#embedContainer')[0];


    // Renderiza o relatório
    report = powerbi.embed(embedContainer, config);


    // Define os eventos para renderização do relatório
    report.off("loaded");
    report.on("loaded", function () {
        console.log("Terminou de carregar o modelo de dados às " + new Date().toLocaleString());
        report.off("loaded");
    });

    report.off("error");
    report.on("error", function (event) {
        console.error("ERRO: " + event.detail);
    });

    report.off("rendered");
    report.on("rendered", function () {
        console.log("Terminou de renderizar o relatório às " + new Date().toLocaleString());
        report.off("rendered");
    });

}
