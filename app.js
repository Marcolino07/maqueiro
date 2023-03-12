var plt = JSON.parse(localStorage.getItem('sv_atend')) ? JSON.parse(localStorage.getItem('sv_atend')) : [];

var HOJE, ANO, MES, DIA, PRDO;
var DATA = '', EDIT = 0, SELECIONADO = [];

function $(tag){return document.querySelector(tag)}
function $$(tag){return document.querySelectorAll(tag)}

const Tela = $$('section');
const Btns = $$('main .dv-btn');
const Setor = $$('select');
const Titulo = $('header #title');
const Periodo = $$('.side-left-periodo li');
const Maqueiro = $('#maqueiro');
const SALVAR = $('#btn-salvar-registrar');
const EXCLUIR = $('#btn-excluir-editar');
const VOLTAR = $('#btn-voltar-periodo');
const Meses = ['JAN','FEV','MAR','ABR','JUN','JUL','AGO','OUT','SET','NOV','DEZ'];


//SIDE MENU MECANISMO – – – – – – – – – – ————————————————————————————————————————————————————————————
const Z7_sideMenu = $('.side-left');
const Z7_sideMenu_btn = $$('.side-left > ul > li > ul li');
const Z7_sideMenu_Out = $('.side-left-out');
$('.side-left-in').addEventListener('click', ()=> { Z7_sideMenu.classList.add('block'); Z7_sideMenu_Out.classList.add('block'); });
Z7_sideMenu_btn.forEach(z =>{ z.addEventListener('click', ()=>{ Z7_sideMenu.classList.remove('block'); Z7_sideMenu_Out.classList.remove('block'); })});
Z7_sideMenu_Out.addEventListener('click', ()=> { Z7_sideMenu.classList.remove('block'); Z7_sideMenu_Out.classList.remove('block'); });

window.onload = (event) => {f_inicio();}

function f_inicio()
{
    HOJE = new Date();
    let dia = String(HOJE.getDate()).padStart(2,'0');
    let mes = String(HOJE.getMonth()+1).padStart(2,'0');
    let ano = String(HOJE.getFullYear());
    HOJE = ano + '-' + mes + '-' + dia;

    if (plt.length)
    {
        if (plt.find(x => x.atd.slice(0,10) == HOJE))
        {
            DATA = HOJE;
            ANO = plt.filter(z => z.atd.slice(0,4) == ano);
            MES = ANO.filter(z => z.atd.slice(5,7) == mes);
            DIA = MES.filter(z => z.atd.slice(8,10) == dia);
            f_plantao();
        }
        else if (plt.find(x => x.atd.slice(0,7) == ano+'-'+mes))
        {
            DATA = ano+'-'+mes+'-';
            ANO = plt.filter(z => z.atd.slice(0,4) == ano);
            MES = ANO.filter(z => z.atd.slice(5,7) == mes);
            f_diaria();
        }
        else if (plt.find(x => x.atd.slice(0,4) == ano))
        {
            DATA = ano+'-';
            ANO = plt.filter(z => z.atd.slice(0,4) == ano);
            f_mensal();
        }
        else f_anual();
    }
    else
    {
    	f_anual();
    	Titulo.innerText = 'MAQUEIRO';
    	$('#dv-periodo').insertAdjacentHTML('afterbegin','<p>Adicione o seu primeiro atendimento</p>');
    }

    let save = localStorage.getItem("sv_maqueiro");

    if (save) { $('#maqueiro h2 span').innerText = save };

    save = JSON.parse(localStorage.getItem("sv_acomp"));

    if (save) {
        save.forEach(x => {
            $('#acomp-list').insertAdjacentHTML("afterbegin", `<option value="${x}"/>`);
    })};

    save = JSON.parse(localStorage.getItem("sv_observ"));

    if (save) {
        save.forEach(x => {
            $('#observ-list').insertAdjacentHTML("afterbegin", `<option value="${x}">`);
    })};

    let opt, n, setores = ['ADM - Administração','AGEND - Agendamento','ALMO - Almoxarifado','ALOJ - Alojamento','AMBU - Ambulatório',
    'CAM - Sala de Equipamentos','CAPE - Capêlania','CC - Centro Cirúrgico','CLAS - Classificação','CLC - Clínica Cirúrgica',
    'CLM - Clínica Médica','CPH - Central de Parto','EME - Emergência','ENDO - Endoscopia','MORGUE - Necrotério','NEO - Neo Natal',
    'NIR - Núcleo Int de Reg','ORTO - Ortopedia','P1 - Portaria 1','P2 - Portaria 2','P3 - Portaria 3','PATO - Patologia',
    'PEDI - Pediatria','RAIO-X','REC - Recepção','RETA - Retaguarda','SIA - Serv de Int e Agend','SOCIAL - Assistente Social',
    'TOMO - Tomografia','ULTRA - Ultrasson','UTI - UTI Adulto','OUTROS - Outros Setores'].sort();
    
    setores.forEach((z)=> {
        n = z.indexOf(" ");
        opt = `<option value="${z.slice(0, n)}">${z}</option>`;
        Setor[0].insertAdjacentHTML("beforeend", opt);
        Setor[1].insertAdjacentHTML("beforeend", opt);
    });
};

//NOME DO MAQUEIRO------------------------------------------------------------
Maqueiro.addEventListener('click', function() {
    let mqr = window.prompt('Digite o seu nome');
    if((mqr)){
        $('#maqueiro h2 span').innerText = mqr;
        localStorage.setItem('sv_maqueiro', mqr);
    }
});

Periodo[0].addEventListener('click', ()=> { f_anual(); });

Periodo[1].addEventListener('click', function(){ DATA = HOJE.slice(0,5); f_mensal(); });

Periodo[2].addEventListener('click', function(){ DATA = HOJE.slice(0,8); f_diaria(); });

Periodo[3].addEventListener('click', function(){ DATA = HOJE; f_plantao(); });

function f_periodo(ttl)
{
    f_selectMenu_cancel();
    f_limpar();

    Titulo.innerText = ttl;
    VOLTAR.classList.remove('opacity');
    
    $('#dv-periodo article').classList = 'dv-'+PRDO;
    $('section.block').classList.remove('block');
    Tela[0].classList.add('block');
    VOLTAR.value = PRDO;
}

$('#side-left-acomp').addEventListener('click', function() { f_dvEditar('ACOMPANHANTES', 'sv_acomp'); EDIT = 2; });
$('#side-left-observ').addEventListener('click', function() { f_dvEditar('OBSERVAÇÕES', 'sv_observ'); EDIT = 3; });


//LIMPA BOTOES DA DIV PERIODOS-----------------------------------------------------------
function f_limpar() {
    $('#dv-periodo article').innerHTML = '';
    $('#dv-editar article').innerHTML = '';
}

//MODO SELECT TIME------------------------------------------------------------------------  
var Z7_selectMenu_time = 0;

function f_selectMenu_time(x, sel)
{
    if (!Z7_selectMenu_time) {
        Z7_selectMenu_time = setTimeout(() => { f_selectMenu_time(x, sel) }, 500);
        x.addEventListener('pointerup', ()=>{ clearTimeout(Z7_selectMenu_time); Z7_selectMenu_time = 0; });
        x.addEventListener('pointermove', ()=>{ clearTimeout(Z7_selectMenu_time);  Z7_selectMenu_time = 0;});
    }
    else {
        f_selectMenu_active();
        x.classList.add('selecionado');
        SELECIONADO.push(sel);
        Z7_selectMenu_time = 0;
    }
}


//MODO SELECT E UNSELECT REGISTROS------------------------------------------------------------------------
function f_selectMenu_item(x, sel)
{
    if(SELECIONADO.find(s => s == sel))
    {
        let i = SELECIONADO.findIndex((s) => s == sel);
        SELECIONADO.splice(i, 1);
        x.classList.remove('selecionado');

        if (SELECIONADO.length == 0)
        {
            if(EDIT == 1)
            {
                setTimeout(() => { f_selectMenu_cancel() }, 200);
            }
            else
            {
                EXCLUIR.classList.add('opacity');
            }
        }
    }
    else
    {
        SELECIONADO.push(sel);
        x.classList.add('selecionado');
        EXCLUIR.classList.remove('opacity');
    }
}
function f_selectMenu_active() {
    EDIT = 1;
    Titulo.classList.add('none');
    $('.select-menu').classList.add('flex');
}
function f_selectMenu_cancel() {
    EDIT = 0;
    SELECIONADO = [];
	$('.select-menu').classList.remove('flex');
	Titulo.classList.remove('none');
	let sel = $$('.selecionado');
	if(sel) sel.forEach(e =>{ e.classList.remove('selecionado') });
}


//CANCELAR EDIÇÃO DE REGISTROS------------------------------------------------------------------------
$('.select-menu-cancel').addEventListener('click', function(){ f_selectMenu_cancel(); });

$('#btn-cancelar-editar').addEventListener('click', ()=>
{
    f_selectMenu_cancel();
    $('section.block').classList.remove('block');
    Tela[0].classList.add('block');

    f_inicio();
});


//EXCLUIR REGISTROS-------------------------------------------------------------
$('.select-menu-garbage').addEventListener('click', function(){ f_selectDelete() });

EXCLUIR.addEventListener('click', function() { f_selectDelete() });

function f_selectDelete()
{
if ((window.confirm("Deseja apagar os itens selecionados?")) && (SELECIONADO.length > 0))
{
    let ttl, sv, lcl;

    switch (EDIT)
    {
        case 1: ttl = Titulo.innerText;

            let data = '';

            if (DATA.length == 10) data = DATA;

            let vl, lgt = SELECIONADO[0].length;

            plt = JSON.parse(localStorage.getItem('sv_atend')).filter((z, x) => f_filter(z, x));

            function f_filter(z, x)
            {
                vl = String(z.atd.slice(0, lgt));

                if (data!='' && !SELECIONADO.includes(vl)){ z.atd = data+'-'+String(++x).padStart(2,'0'); };

                return !SELECIONADO.includes(vl);
            }
        
            localStorage.setItem('sv_atend', JSON.stringify(plt));

            switch (PRDO) {
                case 'plantao': f_plantao(); break;
                case 'diaria': f_diaria(); break;
                case 'mensal': f_mensal(); break;
                case 'anual': f_anual(); break;
            }
        return;

        case 2:
            ttl='ACOMPANHANTES';
            sv = 'sv_acomp';
            lcl = '#acomp-list';
        break;

        case 3:
            ttl='OBSERVAÇÕES';
            sv = 'sv_observ';
            lcl = '#observ-list';
        break;
    }

    let idx, lista = JSON.parse(localStorage.getItem(sv));

    for (let x = 0; x < SELECIONADO.length; x++)
    {
        idx = lista.findIndex((z) => z == SELECIONADO[x] );
        lista.splice( idx, 1)
    }

    localStorage.setItem(sv, JSON.stringify(lista));

    f_dvEditar(ttl, sv);
}};


//EDITAR REGISTRO existente------------------------------
function f_edit(index)
{
    f_selectMenu_cancel();
    $('section.block').classList.remove('block');
    Tela[1].classList.add('block');
    $('#btn-cancelar-registrar').value = Titulo.innerText;

    let z = plt.findIndex((e) => e.atd == index);

    Titulo.innerText = 'ATENDIMENTO ' + String(plt[z].atd.slice(11,13));
    $('#data').value = plt[z].atd.slice(0,10);
    $('#data').disabled = true;
    $('#hora').value = plt[z].hrs;
    Setor[0].value = plt[z].org;
    Setor[1].value = plt[z].dst;
    $('#acomp').value = plt[z].acp;
    $('#observ').value = plt[z].obs;
    SALVAR.value = plt[z].atd;
};


//ADICIONAR REGISTRO na planilha-----------------------------------------
$('#btn-add-periodo').addEventListener('click', function()
{
	f_selectMenu_cancel();
    $('section.block').classList.remove('block');
    Tela[1].classList.add('block');
    $('#btn-cancelar-registrar').value = Titulo.innerText;

    $('#data').value = HOJE;
    $('#data').disabled = false;
    $('#acomp').value = '';
    $('#observ').value = '';
    Setor[0].selectedIndex = 0;
    Setor[1].selectedIndex = 0;

    let data = new Date();
    let hora = String(data.getHours()).padStart(2,'0');
    let min = String(data.getMinutes()).padStart(2,'0');

    hora = hora + ':' + min;
    $('#hora').value = hora;

    if(plt==[])
    {
        Titulo.innerText = 'ATENDIMENTO 01';
        SALVAR.value = HOJE+'-01';
    }
    else
    {
        let flt = plt.filter(d => d.atd.slice(0,10) == HOJE).length;

        

        if (flt == 0)
        {
            Titulo.innerText = 'ATENDIMENTO 01';
            SALVAR.value = HOJE+'-01';
        }
        else
        {
            let add = String(flt+1).padStart(2,'0');
            Titulo.innerText = 'ATENDIMENTO ' + add;
            SALVAR.value = HOJE+'-'+add;
            
        }
    }
    Setor[0].focus();
    Setor[0].click();
});


//SALVAR as adições ou modificações de registros-------------------------------------------
SALVAR.addEventListener('click', function()
{
    PRDO = 'plantao';
    let data = $('#data').value;
    let hora = $('#hora').value;
    let origem = Setor[0].value;
    let destino = Setor[1].value;
    let acomp = $('#acomp').value.trim();
    let observ = $('#observ').value.trim();
    DATA = data;

    let registro = {
        atd: f_atd(data, this.value),
        hrs: hora,
        org: origem,
        dst: destino,
        acp: acomp,
        obs: observ
    };

    //Verifica se é ediçao ou adição de registro e retorna o num do atendimento-------------------------
    function f_atd(data, atendimento)
    {
        var nAtend = data+'-01';
    
        if (plt.length)
        {
            for (let z = 0; z < plt.length; z++) {if (plt[z].atd == atendimento) return atendimento; }

            let flt = plt.filter(d => d.atd.slice(0,10) == data);

            if (flt.length) nAtend = data+'-'+String(flt.length+1).padStart(2,'0');
        }
        else $('#dv-periodo > p').classList.add('none');
    
        return nAtend;
    }

    if(acomp){f_dataList_add(acomp, 'sv_acomp')}
    if(observ){f_dataList_add(observ, 'sv_observ')}

    //DATALIST ADD---------------------------------------------
    function f_dataList_add(valor, sv)
    {
        let list = JSON.parse(localStorage.getItem(sv)) ? JSON.parse(localStorage.getItem(sv)) : [];

        if (list.find(z => z ==  valor)) return;

        list.unshift(valor);

        list.sort();

        localStorage.setItem(sv, JSON.stringify(list));

        sv = sv.replace('sv_','');

        let el = document.getElementById(sv+'-list');

        el.insertAdjacentHTML("afterbegin", `<option value="${valor}">`);
    }

    if (plt.length)
    {
        let z;
        for (z = 0; z < plt.length; z++) {if (plt[z].atd == registro.atd) break }
        plt[z] = registro;
    }    
    else
    {
        plt.push(Object.assign({}, registro));
    }


    localStorage.setItem('sv_atend', JSON.stringify(plt)); //salva o ATENDIMENTO na pasta PLANTAO

    ANO = plt.filter(z => z.atd.slice(0,4) == data.slice(0,4));

    MES = ANO.filter(z => z.atd.slice(5,7) == data.slice(5,7));

    DIA = MES.filter(z => z.atd.slice(8,10) == data.slice(8,10));

    f_plantao();
});


//CANCELAR Registro-------------------------------------------------
$('#btn-cancelar-registrar').addEventListener('click', function()
{
    let dv = 'dv-'+PRDO;

    Titulo.innerText = this.value;

    Tela[1].classList.remove('block');
    Tela[0].classList.add('block');
    $('#dv-periodo article').classList = dv;
});


//TELA DE REGISTRO---------------------------------------------------------------------
//Identifica a planilha correta para inserir o atendimento--------------------------------------
$('#data').addEventListener('change', function()
{
    let data = this.value;

    let valor = ['ATENDIMENTO', data+'-01'];

    if(plt.length)
    {
        let flt = plt.filter(d => d.atd.slice(0, 10) == data);

        if (flt)
        {
            let add = String(++flt.length).padStart(2,'0');
            valor[0] = 'ATENDIMENTO ' + add;
            valor[1] = data+'-'+add;
        }
    }

    Titulo.innerText = valor[0];
    SALVAR.value = valor[1];
});


Setor[0].addEventListener('change', function()
{
    let org = this.value;
    let dst = Setor[1];
    if ((org == 'CLC')||(org == 'ORTO')||(org == 'CPH')||(org == 'PATO')||(org == 'CLAS'))
    {
        Setor[1].value = 'CC';
        $('#acomp').focus();
        $('#acomp').click();
    }
    else if ((Setor[0] == 'CAM')&&(Setor[1].value))
    {
        $('#acomp').value = 'Equipamento'; SALVAR.focus(); SALVAR.click();
    }
    else Setor[1].focus();
});
Setor[1].addEventListener('change', function()
{
    let obs = $('#observ');
    if ((Setor[0].value)&&(Setor[1].value == 'CAM'))
    {
        obs.value = 'Equipamento'; SALVAR.focus(); SALVAR.click();
    }
    else if ((Setor[0].value == 'REC')&&(Setor[1].value == 'MORGUE'))
    {
        obs.value = 'Retirar'; SALVAR.focus(); SALVAR.click();
    }
    else if ((Setor[0].value == 'NIR')||(Setor[1].value == 'NIR')||(Setor[0].value == 'SIA'))
    {
    	obs.value = 'Documento'; SALVAR.focus(); SALVAR.click();
    }
    else if (Setor[0].value == 'ALMO')
    {
    	obs.value = 'Pedidos'; SALVAR.focus(); SALVAR.click();
    }
    else if ((Setor[1].value == 'CLC' || Setor[1].value == 'ORTO' || Setor[1].value == 'ALOJ')&&(Setor[0].value == ''))
    {
    	Setor[0].value = 'CC';
        $('#acomp').focus();
        $('#acomp').click();
    }
    else
    {
        $('#acomp').focus();
        $('#acomp').click();
    }
});


$('#acomp').addEventListener('keydown', (z)=>
{
	let obs = $('#observ');

   	if (z.key == "Enter")
	{
	    if ($('#acomp').value)
	    {
	    	SALVAR.focus(); SALVAR.click(); return;
	    }
	    else
	    {
            if ((Setor[0].value == 'CLAS' || Setor[0].value == 'PATO' || Setor[0].value == 'CPH')&&(Setor[1].value == 'CC'))
    	    {
        		obs.value = 'Aviso'; SALVAR.focus(); SALVAR.click(); return;
    	    }
            else
            {
                obs.focus(); obs.click();
            }
	    }
	}
});
$('#observ').addEventListener('keydown', (z)=>
{
    if (z.key == "Enter") { SALVAR.focus(); SALVAR.click(); }
});


//INSERIR LISTAS ---------------------------------------------
function f_dvEditar(ttl, sv)
{
    Titulo.innerHTML = ttl;
    if (!Tela[2].classList.contains('block'))
    {
        $('section.block').classList.remove('block');
        Tela[2].classList.add('block');
    }

    EXCLUIR.classList.add('opacity');

    let lst = sv.replace('sv_','')+'-list';
    
    $('#dv-editar article').innerHTML = '';
    document.getElementById(lst).innerHTML = '';

    let lista = JSON.parse(localStorage.getItem(sv));

    if (lista)
    {
        lista.sort();
        
        lista.forEach(z =>
        {
            $('#dv-editar > article').insertAdjacentHTML("beforeend", `<button type="button" class="atd">${z}</button>`);
            
            document.getElementById(lst).insertAdjacentHTML("afterbegin", `<option value="${z}">`);
        });

	    let bt = $$('#dv-editar > article > button');
	    bt.forEach(z =>
	    {
	        z.addEventListener('click', function()
	        {
	            let sel = z.innerText;
	            f_selectMenu_item(z, sel);
	        });
	    });
    }
}


//VOLTAR para a tela anterior-------------------------------------------------------------------------------------
VOLTAR.addEventListener('click', function()
{
    if (PRDO!='anual')
    {
        f_selectMenu_cancel();

        if (PRDO == 'mensal')
        {
            f_anual();
        }
        else if (PRDO == 'diaria')
        {
            DATA = DATA.slice(0,5);
            ANO = plt.filter(a => a.atd.slice(0,5) == DATA);
            f_mensal();
        }
        else if (PRDO == 'plantao')
        {
            DATA = DATA.slice(0,8);
            MES = ANO.filter(a => a.atd.slice(0,8) == DATA);
            f_diaria();
        }
    }
});


//LIMPAR Registros Geralzão-------------------------------------------------------------------------------------
$('#side-left-limpar').addEventListener('click', function()
{
    if (window.confirm("Deseja apagar todos os atendimentos?"))
    {
        localStorage.removeItem('sv_atend');
        f_limpar();
        document.location.reload();
    }
});


//RESETAR TODOS OS DADOS-------------------------------------------------------------------
$('#side-left-resetar').addEventListener('click', function()
{
    if (window.confirm("DESEJA APAGAR E RESETAR TODOS OS DADOS?"))
    {
        localStorage.removeItem('sv_atend');
        localStorage.removeItem('sv_maqueiro');
        localStorage.removeItem('sv_acomp');
        localStorage.removeItem('sv_observ');
        document.location.reload();
    }
});


function f_anual()
{
    DATA = ''; PRDO = 'anual';

    f_periodo('ANUAL');

    VOLTAR.classList.add('opacity');

    if (plt.length)
    {
        plt.sort((a, b) => a.atd - b.atd);

        let ano = plt[0].atd.slice(0,4);

        let atds = plt.filter(a => a.atd.slice(0,4) == ano).length;

        while (ano)
        {
            $('#dv-periodo article').insertAdjacentHTML
            (
                "beforeend", `<button type="button" value="${ano}"><p>${ano}</p><p>${atds} atendimentos</p></button>`
            );
            ano = plt.find(x => x.atd.slice(0,4) > ano);
            if(ano) ano = ano.atd.slice(0,4);
        }

        btPrd = $$('#dv-periodo > article > button');
        btPrd.forEach(x =>
        {
            x.addEventListener('pointerdown', function()
            {
                let sel = x.value;
                if (EDIT) { f_selectMenu_item(x, sel); return }
                f_selectMenu_time(x, sel);
            });
            x.addEventListener('click', function()
            {
                if(!(EDIT))
                {
                    DATA = x.value + '-';
                    f_mensal();
                }
            });
        });
    }
}

function f_mensal()
{
    PRDO = 'mensal';

    f_periodo(DATA.slice(0,4));

    ANO = plt.filter(z => z.atd.slice(0,DATA.length) == DATA);
    ANO.sort((a, b) => a.atd.slice(5,7) - b.atd.slice(5,7));

    let mes, q, v = ANO[0];

    while (v)
    {
        mes = v.atd.slice(5,7);
        q = ANO.filter(a => a.atd.slice(5,7) == mes);
        $('#dv-periodo article').insertAdjacentHTML
        (
            "beforeend", `<button type="button" value="${mes}"><p>${Meses[mes-1]}</p><p>${q.length} Atendimentos</p></button>`
        );
        v = ANO.find(m => m.atd.slice(5,7) > mes);
    }

    btPrd = $$('#dv-periodo > article button');
    btPrd.forEach(z =>
    {
        z.addEventListener('pointerdown', function() 
        {
            let sel = DATA + z.value;
            if (EDIT) {f_selectMenu_item(z, sel); return }
            f_selectMenu_time(z, sel);
        });

        z.addEventListener('click', function()
        {
            if(!(EDIT))
            {
                DATA = DATA + z.value + '-';
                f_diaria();
            }
        });
    });
}

function f_diaria()
{
    PRDO = 'diaria';

    let n = parseInt(DATA.slice(5,7)-1);

    f_periodo(Meses[n]+' '+DATA.slice(0,4));

    MES = plt.filter(z => z.atd.slice(0,DATA.length) == DATA);
    MES.sort((a, b) => a.atd.slice(8,10) - b.atd.slice(8,10));

    let dia, q, v = MES[0];

    while (v)
    {
        dia = v.atd.slice(8,10);
        q = MES.filter(a => a.atd.slice(8,10) == dia)
        $('#dv-periodo article').insertAdjacentHTML
        (
            "beforeend", `<button type="button" value="${dia}"><p>${dia}</p><p>${q.length} Atend</p></button>`
        );
        v = MES.find(m => m.atd.slice(8,10) > dia);
    }

    btPrd = $$('#dv-periodo > article button');
    btPrd.forEach(x =>
    {
        x.addEventListener('pointerdown', function()
        {
            let sel = DATA + x.value;
            if (EDIT) { f_selectMenu_item(x, sel); return }
            f_selectMenu_time(x, sel);
        });

        x.addEventListener('click', function()
        {
            if(!(EDIT))
            {
                DATA = DATA + x.value;
                f_plantao();
            }
        });
    });
}

function f_plantao()
{
    PRDO = 'plantao';

    f_periodo( DATA.split('-').reverse().join().replace(/,/g, ' / ') );

    DIA = plt.filter(z => z.atd.slice(0,DATA.length) == DATA);

    DIA.forEach((z, x) =>
    {
        if(!(z.acp)) z.acp='----';
        $('#dv-periodo article').insertAdjacentHTML
        (
            "beforeend", `<button type="button" class="atd" value="${z.atd}"><span>${String(x+1).padStart(2, '0')}</span><span class="hrs">${z.hrs}</span><p><span class="org">${z.org}</span><span class="dst">${z.dst}</span><span class="acp">${z.acp}</span><span class="obs">${z.obs}</span></p></button>`
        );
    });

    btPrd = $$('#dv-periodo > article button');
    btPrd.forEach(z =>
    {
        z.addEventListener('pointerdown', ()=>
        {
            let sel = z.value;
            if (EDIT) {f_selectMenu_item(z, sel); return }
            f_selectMenu_time(z, sel);
        });

        z.addEventListener('click', ()=>
        {
            if(!(EDIT)) { f_edit(z.value) }
        });
    });
}