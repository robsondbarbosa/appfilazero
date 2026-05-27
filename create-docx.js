const fs = require('fs');
const docx = require('docx');
const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer, Table, TableCell, TableRow, WidthType, BorderStyle } = docx;

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            // Título
            new Paragraph({
                text: "Apostila de Estudos: Introdução e Impacto da Inteligência Artificial",
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
            }),
            
            // Subtítulo
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Disciplina: Introdução à Tecnologia e Sociedade",
                        bold: true,
                        size: 24
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Módulo: O Futuro Digital e a IA",
                        bold: true,
                        size: 24
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
            }),
            
            // Introdução
            new Paragraph({
                text: "Introdução: O que é a Inteligência Artificial?",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
                text: "Quando pensamos em Inteligência Artificial (IA), a ficção científica costuma nos guiar para robôs conscientes que andam, falam e tomam decisões como humanos. No entanto, a realidade prática da IA hoje é bem diferente e muito mais integrada ao nosso cotidiano.",
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                text: "Em termos simples, a Inteligência Artificial atual funciona como um Super Detetive de Padrões. Ela não possui sentimentos, consciência ou desejos. Em vez disso, ela analisa volumes gigantescos de dados para descobrir regras, fazer previsões e gerar soluções de forma automatizada.",
                spacing: { after: 400 }
            }),
            
            // Capítulo 1
            new Paragraph({
                text: "Capítulo 1: A Anatomia da IA — Como as Máquinas Aprendem?",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
                text: "Para entender o funcionamento dessa tecnologia, precisamos compreender que a IA é dividida em camadas, semelhante a uma caixa de ferramentas onde cada divisória tem uma especialidade:",
                spacing: { after: 200 }
            }),
            
            // Hierarquia em tabela
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph({ text: "1. INTELIGÊNCIA ARTIFICIAL (Conceito Amplo)", bold: true })],
                                shading: { fill: "4472C4" }
                            })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph({ text: "    2. MACHINE LEARNING (Aprendizado com Dados)", bold: true })],
                                shading: { fill: "5B9BD5" }
                            })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph({ text: "        3. DEEP LEARNING (Redes Neurais)", bold: true })],
                                shading: { fill: "9DC3E6" }
                            })
                        ]
                    })
                ]
            }),
            
            new Paragraph({ text: "", spacing: { after: 200 } }),
            
            new Paragraph({
                text: "1. Inteligência Artificial (Conceito Geral)",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
            }),
            
            new Paragraph({
                text: "É o campo da ciência da computação dedicado a criar sistemas capazes de realizar tarefas que normalmente exigiriam inteligência humana, como traduzir idiomas, reconhecer imagens ou tomar decisões médicas.",
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                text: "2. Machine Learning (Aprendizado de Máquina)",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
            }),
            
            new Paragraph({
                text: "Em vez de um programador escrever regras rígidas na linha de código (como 'se o usuário fizer isso, exiba aquilo'), no Machine Learning nós damos milhares de exemplos para o computador.",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "Como funciona na prática? Um algoritmo de recomendação de streaming analisa o histórico de tudo o que você assistiu. Ele cruza esses dados com o perfil de milhões de outros usuários para adivinhar e recomendar qual será o seu próximo filme favorito. Ele aprendeu o seu padrão de comportamento.",
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                text: "3. Deep Learning (Aprendizado Profundo)",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
            }),
            
            new Paragraph({
                text: "É um subcampo avançado do Machine Learning que utiliza Redes Neurais Artificiais, estruturas de algoritmos vagamente inspiradas no funcionamento dos neurônios do cérebro humano. Essas redes possuem múltiplas camadas de processamento, permitindo que a máquina resolva problemas de altíssima complexidade, como o reconhecimento facial tridimensional de um smartphone ou a navegação em tempo real de carros autônomos.",
                spacing: { after: 400 }
            }),
            
            // Capítulo 2
            new Paragraph({
                text: "Capítulo 2: A Revolução da IA Generativa e os Modelos de Linguagem",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
                text: "Nos últimos anos, o mundo conheceu ferramentas capazes de criar novos conteúdos: textos, códigos de programação, músicas e imagens realistas. Essa vertente é chamada de IA Generativa.",
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                text: "O que são LLMs?",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
            }),
            
            new Paragraph({
                text: "As ferramentas de chat que utilizam texto funcionam através de LLMs (Large Language Models, ou Grandes Modelos de Linguagem). Sistemas como o ChatGPT e o Google Gemini não 'pensam' no significado das coisas como nós. Eles atuam como um Super Gerador Estatístico da Próxima Palavra.",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "Ao receber uma instrução sua (um prompt), a IA analisa bilhões de textos com os quais foi treinada e calcula matematicamente qual palavra tem a maior probabilidade estatística de vir logo após a palavra anterior, considerando o contexto.",
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                text: "O Fenômeno da 'Alucinação'",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
            }),
            
            new Paragraph({
                text: "Por operarem puramente à base de probabilidades e padrões textuais (e não de checagem da verdade factual), as IAs podem cometer erros graves conhecidos como alucinações.",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "Uma alucinação ocorre quando o sistema gera uma informação totalmente falsa, inventando dados, datas ou biografias inteiras, mas escreve isso com um tom extremamente profissional, seguro e convincente. Por isso, nunca devemos utilizar a IA como fonte única de verdade sem verificar as informações em fontes confiáveis.",
                spacing: { after: 400 }
            }),
            
            // Capítulo 3
            new Paragraph({
                text: "Capítulo 3: Ética, Desafios e o Futuro na Sociedade",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
                text: "O avanço tecnológico traz benefícios imensos para a produtividade, mas também exige um olhar crítico sobre suas consequências sociais.",
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                text: "1. Viés Algorítmico (Bias)",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
            }),
            
            new Paragraph({
                text: "A inteligência artificial aprende utilizando dados criados por seres humanos históricos. Se os dados fornecidos para o treinamento de uma IA contiverem preconceitos ocultos ou históricos da nossa sociedade (como discriminação de gênero, raça ou classe), a máquina irá aprender, replicar e, pior, automatizar e amplificar esses mesmos preconceitos. A IA reflete diretamente a cultura e os dados de quem a treinou.",
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                text: "2. Deepfakes e Desinformação",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
            }),
            
            new Paragraph({
                text: "Utilizando algoritmos avançados de imagem e áudio, softwares de IA conseguem hoje criar Deepfakes: vídeos ou gravações de áudio falsas que simulam com perfeição cirúrgica o rosto, a voz e os movimentos de pessoas reais. Isso representa um risco imenso para a segurança digital e para a proliferação de notícias falsas (fake news), exigindo do cidadão comum atenção redobrada à origem de mídias sensíveis compartilhadas na internet.",
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                text: "3. O Profissional do Futuro",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
            }),
            
            new Paragraph({
                text: "Muitas pessoas temem ser totalmente substituídas pela tecnologia. No entanto, analistas de mercado apontam para uma máxima realista: 'A inteligência artificial não vai substituir você; mas um profissional que sabe usar a inteligência artificial vai.'",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "O mercado do futuro valorizará indivíduos que consigam desenvolver suas soft skills — habilidades puramente humanas como empatia, criatividade, liderança e pensamento crítico — e que utilizem a IA como uma ferramenta poderosa de assistência e co-criação.",
                spacing: { after: 400 }
            }),
            
            // Guia Prático
            new Paragraph({
                text: "Guia Prático: O que é Engenharia de Prompt?",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
                text: "Para extrair o melhor de qualquer IA generativa, não basta fazer perguntas simples. A prática de formular, estruturar e refinar comandos de texto para guiar a máquina ao resultado perfeito chama-se Engenharia de Prompt.",
                spacing: { after: 200 }
            }),
            
            new Paragraph({
                text: "Um prompt excelente costuma seguir a estrutura dos 4 Elementos Técnicos:",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "1. Papel/Atuação: Diga à IA quem ela é. (Ex: 'Atue como um especialista em nutrição...')",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "2. Contexto/Tarefa: Explique o cenário detalhadamente. (Ex: 'Preciso criar um cardápio semanal para alguém que corre 5km por dia...')",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "3. Restrições: Defina o que ela não pode fazer. (Ex: 'Não inclua derivados de leite ou açúcar refinado...')",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "4. Formato de Saída: Escolha como quer ver a resposta. (Ex: 'Organize o resultado final em formato de tabela dividida por dias da semana.')",
                spacing: { after: 400 }
            }),
            
            // Glossário
            new Paragraph({
                text: "Glossário Rápido de Termos Técnicos",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
            }),
            
            new Paragraph({
                text: "• Algoritmo: Uma sequência passo a passo de instruções matemáticas ou lógicas que o computador segue para resolver um problema.",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "• Dados de Treino: O conjunto de arquivos (textos, imagens, tabelas) usado para ensinar um modelo de IA a reconhecer padrões.",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "• Prompt: A instrução de texto, comando ou pergunta enviada pelo usuário para iniciar a resposta de uma IA.",
                spacing: { after: 100 }
            }),
            
            new Paragraph({
                text: "• Rede Neural Artificial: Sistema de computação estruturado em nós interconectados que imita o modelo de processamento do cérebro humano para analisar grandes volumes de dados.",
                spacing: { after: 200 }
            }),
            
            // Rodapé
            new Paragraph({
                text: "",
                spacing: { before: 400 }
            }),
            
            new Paragraph({
                text: "________________________________________",
                alignment: AlignmentType.CENTER,
                spacing: { before: 400, after: 100 }
            }),
            
            new Paragraph({
                text: "Documento gerado para fins educacionais",
                alignment: AlignmentType.CENTER,
                italics: true,
                size: 20
            })
        ]
    }]
});

// Salvar documento
Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('C:/Users/RTI/.verdent/verdent-projects/Apostila_IA.docx', buffer);
    console.log('Documento Word criado com sucesso!');
});
