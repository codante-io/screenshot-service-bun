import { eq } from 'drizzle-orm';
import { connection, db } from '../db/db';
import {
  expenses as expensesTable,
  senators as senatorsTable,
} from '../db/schema';

type OriginalExpense = {
  id: string;
  tipoDocumento: string;
  ano: number;
  mes: number;
  nomeSenador: string;
  tipoDespesa: string;
  cpfCnpj: string;
  fornecedor: string;
  documento: string;
  data: string;
  detalhamento: string;
  valorReembolsado: number;
};

type Expense = {
  senator_id: number;
  party: string;
  uf: string;
  original_id: string;
  date: string;
  expense_category: string;
  amount: number;
  description: string;
  supplier: string;
  supplier_document: string;
  senatorName: string;
};

export async function scrapeExpenses(year: number) {
  let baseUrl = `https://adm.senado.gov.br/adm-dadosabertos/api/v1/senadores/despesas_ceaps/${year}`;

  for (let i = year; i <= year; i++) {
    const url = baseUrl;

    const data = await fetch(url);
    const expenses: OriginalExpense[] = await data.json();

    const sanitizedExpenses: Expense[] = expenses.map((expense) => {
      return {
        senator_id: 0,
        party: '',
        uf: '',
        original_id: expense.id,
        date: expense.data,
        expense_category: expense.tipoDespesa,
        amount: expense.valorReembolsado,
        description: expense.detalhamento,
        supplier: expense.fornecedor,
        supplier_document: expense.cpfCnpj,
        senatorName: expense.nomeSenador.toLowerCase(),
      };
    });

    let count = 0;
    for (const expense of sanitizedExpenses) {
      const dbSenator = await db.query.senators.findFirst({
        where: eq(
          senatorsTable.name,
          senatorNameAdjustment(expense.senatorName)
        ),
      });

      if (!dbSenator) {
        console.log(`Senator ${expense.senatorName} not found in database`);
        continue;
      }

      expense.senator_id = dbSenator.id;
      expense.party = dbSenator.party ?? '';
      expense.uf = dbSenator.UF ?? '';

      try {
        await db.insert(expensesTable).values(expense);
      } catch (e) {
        // console.log(e.message);
        continue;
      }

      count++;
      console.log(count);
    }
  }
}

function senatorNameAdjustment(senatorName: string) {
  const senatorTable: { [key: string]: string } = {
    'samuel araujo': 'Dr. Samuel Araújo',
    'weverton rocha': 'Weverton',
    'jean paul prates': 'Jean-Paul Prates',
    'maria eliza de aguiar e silva': 'Maria Eliza',
  };

  if (senatorTable[senatorName]) {
    return senatorTable[senatorName];
  }

  return senatorName;
}
