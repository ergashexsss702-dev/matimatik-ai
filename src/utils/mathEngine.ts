import { GradeLevel, Question, SubjectType } from '../types';

export function generateAlgorithmicQuestions(
  grade: GradeLevel,
  subject: SubjectType,
  topic: string,
  count: number,
  _language: string = 'uz'
): Question[] {
  const results: Question[] = [];

  for (let i = 1; i <= count; i++) {
    let questionText = '';
    let formula = '';
    let correctAnswer = '';
    let explanation = '';
    let steps: string[] = [];
    let options: string[] = [];

    if (subject === 'Matematika' && grade <= 4) {
      if (topic.includes('Qo‘shish') || topic.includes('ayirish') || topic.includes('20') || topic.includes('100')) {
        const a = Math.floor(Math.random() * (grade * 15 + 10)) + 5;
        const b = Math.floor(Math.random() * (grade * 12 + 8)) + 3;
        const isAdd = Math.random() > 0.4;
        if (isAdd) {
          const ans = a + b;
          questionText = `${a} + ${b} = ?`;
          formula = `${a} + ${b}`;
          correctAnswer = `${ans}`;
          explanation = `${a} ga ${b} ni qo‘shganda ${ans} hosil bo‘ladi.`;
          steps = [
            `1-qadam: Birinchi son: ${a}`,
            `2-qadam: Ikkinchi son: ${b}`,
            `3-qadam: Birliklarni va o‘nliklarni qo‘shamiz: ${a} + ${b} = ${ans}`,
          ];
          options = shuffle([ans, ans + 1, Math.max(1, ans - 1), ans + 10].map(String));
        } else {
          const top = Math.max(a, b) + 5;
          const sub = Math.min(a, b);
          const ans = top - sub;
          questionText = `${top} - ${sub} = ?`;
          formula = `${top} - ${sub}`;
          correctAnswer = `${ans}`;
          explanation = `${top} dan ${sub} ni ayirganda ${ans} qoladi.`;
          steps = [
            `1-qadam: Kamayuvchi: ${top}`,
            `2-qadam: Ayriluvchi: ${sub}`,
            `3-qadam: Ayirishni bajaramiz: ${top} - ${sub} = ${ans}`,
          ];
          options = shuffle([ans, ans + 2, Math.max(0, ans - 2), ans + 5].map(String));
        }
      } else if (topic.includes('Ko‘paytirish') || topic.includes('bo‘lish')) {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const isMul = Math.random() > 0.4;
        if (isMul) {
          const ans = a * b;
          questionText = `${a} × ${b} = ?`;
          formula = `${a} \\times ${b}`;
          correctAnswer = `${ans}`;
          explanation = `${a} ni ${b} marta ko‘paytirganda ${ans} chiqadi.`;
          steps = [
            `1-qadam: Birinchi ko‘paytuvchi: ${a}`,
            `2-qadam: Ikkinchi ko‘paytuvchi: ${b}`,
            `3-qadam: Ko‘paytirish jadvali bo‘yicha: ${a} × ${b} = ${ans}`,
          ];
          options = shuffle([ans, ans + a, Math.max(1, ans - 1), ans + b].map(String));
        } else {
          const prod = a * b;
          const ans = a;
          questionText = `${prod} ÷ ${b} = ?`;
          formula = `${prod} : ${b}`;
          correctAnswer = `${ans}`;
          explanation = `${prod} ni ${b} ga bo‘lganda ${ans} bo‘ladi.`;
          steps = [
            `1-qadam: Bo‘linuvchi: ${prod}, bo‘luvchi: ${b}`,
            `2-qadam: ${b} ni nechaga ko‘paytirsak ${prod} bo‘ladi: ${b} × ${ans} = ${prod}`,
            `3-qadam: Demak, ${prod} ÷ ${b} = ${ans}`,
          ];
          options = shuffle([ans, ans + 1, Math.max(1, ans - 1), ans + 2].map(String));
        }
      } else {
        const count1 = Math.floor(Math.random() * 15) + 5;
        const count2 = Math.floor(Math.random() * 10) + 3;
        const valiCount = count1 + count2;
        const total = count1 + valiCount;
        questionText = `Ali ${count1} ta daftar sotib oldi. Vali esa undan ${count2} ta ko‘p daftar oldi. Ular jami nechta daftar olishgan?`;
        formula = `${count1} + (${count1} + ${count2})`;
        correctAnswer = `${total}`;
        explanation = `Ali ${count1} ta, Vali ${valiCount} ta oldi. Jami ${total} ta bo‘ldi.`;
        steps = [
          `1-qadam: Alining daftarlari: ${count1} ta`,
          `2-qadam: Valining daftarlari: ${count1} + ${count2} = ${valiCount} ta`,
          `3-qadam: Jami miqdor: ${count1} + ${valiCount} = ${total} ta`,
        ];
        options = shuffle([total, total - 2, total + 3, valiCount].map(String));
      }
    } else if (grade >= 5 && grade <= 6) {
      if (topic.includes('Kasrlar') || topic.includes('kasr')) {
        const denom = [4, 5, 8, 10, 12][Math.floor(Math.random() * 5)];
        const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
        const num2 = Math.floor(Math.random() * (denom - num1)) + 1;
        const sumNum = num1 + num2;
        questionText = `Hisoblang: ${num1}/${denom} + ${num2}/${denom} = ?`;
        formula = `\\frac{${num1}}{${denom}} + \\frac{${num2}}{${denom}}`;
        correctAnswer = `${sumNum}/${denom}`;
        explanation = `Maxrajlari bir xil bo‘lgan kasrlarni qo‘shishda maxraj o‘zgarmaydi, suratlar qo‘shiladi.`;
        steps = [
          `1-qadam: Umumiy maxraj: ${denom}`,
          `2-qadam: Suratlarni qo‘shamiz: ${num1} + ${num2} = ${sumNum}`,
          `3-qadam: Natija: ${sumNum}/${denom}`,
        ];
        options = shuffle([
          `${sumNum}/${denom}`,
          `${sumNum}/${denom * 2}`,
          `${sumNum + 1}/${denom}`,
          `${Math.max(1, sumNum - 1)}/${denom}`,
        ]);
      } else if (topic.includes('Foiz')) {
        const base = [100, 200, 300, 400, 500, 800][Math.floor(Math.random() * 6)];
        const p = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
        const ans = (base * p) / 100;
        questionText = `${base} sonining ${p}% ini toping.`;
        formula = `\\frac{${base} \\times ${p}}{100}`;
        correctAnswer = `${ans}`;
        explanation = `Sonning foizini topish uchun sonni foizga ko‘paytirib, 100 ga bo‘lamiz.`;
        steps = [
          `1-qadam: Berilgan son: ${base}, foiz: ${p}%`,
          `2-qadam: Hisoblash: (${base} × ${p}) / 100`,
          `3-qadam: Natija: ${ans}`,
        ];
        options = shuffle([ans, ans + 10, Math.max(5, ans - 5), ans * 2].map(String));
      } else {
        const x = Math.floor(Math.random() * 12) + 2;
        const a = Math.floor(Math.random() * 15) + 3;
        const b = x + a;
        questionText = `Tenglamani yeching: x + ${a} = ${b}`;
        formula = `x + ${a} = ${b}`;
        correctAnswer = `x = ${x}`;
        explanation = `Noma'lum qo‘shiluvchini topish uchun: x = ${b} - ${a} = ${x}.`;
        steps = [
          `1-qadam: Berilgan tenglama: x + ${a} = ${b}`,
          `2-qadam: x ni ajratamiz: x = ${b} - ${a}`,
          `3-qadam: x = ${x}`,
        ];
        options = shuffle([`x = ${x}`, `x = ${x + 2}`, `x = ${x - 1}`, `x = ${x + 5}`]);
      }
    } else {
      if (topic.includes('Kvadrat tenglama') || topic.includes('diskriminant')) {
        const x1 = Math.floor(Math.random() * 5) + 1;
        const x2 = Math.floor(Math.random() * 4) + 1;
        const b = -(x1 + x2);
        const c = x1 * x2;
        const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        const cSign = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
        questionText = `Kvadrat tenglamaning ildizlarini toping: x² ${bSign}x ${cSign} = 0`;
        formula = `x^2 ${bSign}x ${cSign} = 0`;
        correctAnswer = x1 === x2 ? `x = ${x1}` : `x₁ = ${Math.min(x1, x2)}, x₂ = ${Math.max(x1, x2)}`;
        explanation = `Viyet teoremasiga ko‘ra ildizlar yig‘indisi ${-b}, ko‘paytmasi ${c} ga teng.`;
        steps = [
          `1-qadam: D = b² - 4ac = (${b})² - 4·1·(${c}) = ${b * b - 4 * c}`,
          `2-qadam: √D = ${Math.round(Math.sqrt(b * b - 4 * c))}`,
          `3-qadam: x = (-b ± √D) / 2 => ${correctAnswer}`,
        ];
        options = shuffle([
          correctAnswer,
          `x₁ = ${x1 + 1}, x₂ = ${x2 + 2}`,
          `x₁ = ${-x1}, x₂ = ${-x2}`,
          `x₁ = ${x1 + 2}, x₂ = ${x2 - 1}`,
        ]);
      } else if (topic.includes('Daraja') || topic.includes('Algebraik ifoda') || topic.includes('Ko‘phad')) {
        const base = Math.floor(Math.random() * 4) + 2;
        const exp1 = Math.floor(Math.random() * 3) + 2;
        const exp2 = Math.floor(Math.random() * 3) + 1;
        const totalExp = exp1 + exp2;
        const ansVal = Math.pow(base, totalExp);
        questionText = `Hisoblang: ${base}^${exp1} × ${base}^${exp2} = ?`;
        formula = `${base}^{${exp1}} \\cdot ${base}^{${exp2}}`;
        correctAnswer = `${base}^${totalExp} (${ansVal})`;
        explanation = `Bir xil asosli darajalarni ko‘paytirishda darajalar qo‘shiladi: aᵐ · aⁿ = aᵐ⁺ⁿ.`;
        steps = [
          `1-qadam: Asos: ${base}, daraja ko‘rsatkichlari: ${exp1} va ${exp2}`,
          `2-qadam: Ko‘rsatkichlarni qo‘shamiz: ${exp1} + ${exp2} = ${totalExp}`,
          `3-qadam: Natija: ${base}^${totalExp} = ${ansVal}`,
        ];
        options = shuffle([
          `${base}^${totalExp} (${ansVal})`,
          `${base}^${exp1 * exp2} (${Math.pow(base, exp1 * exp2)})`,
          `${base * 2}^${totalExp}`,
          `${base}^${totalExp + 1}`,
        ]);
      } else {
        const k = Math.floor(Math.random() * 5) + 2;
        const root = Math.floor(Math.random() * 8) + 2;
        const add = Math.floor(Math.random() * 10) + 1;
        const right = k * root + add;
        questionText = `Tenglamani yeching: ${k}x + ${add} = ${right}`;
        formula = `${k}x + ${add} = ${right}`;
        correctAnswer = `x = ${root}`;
        explanation = `${k}x = ${right} - ${add} => ${k}x = ${right - add} => x = ${root}.`;
        steps = [
          `1-qadam: ${k}x = ${right} - ${add}`,
          `2-qadam: ${k}x = ${right - add}`,
          `3-qadam: x = ${root}`,
        ];
        options = shuffle([`x = ${root}`, `x = ${root + 1}`, `x = ${Math.max(1, root - 1)}`, `x = ${root * 2}`]);
      }
    }

    results.push({
      id: `q_${i}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      number: i,
      question: questionText,
      formula: formula,
      options: options,
      correctAnswer: correctAnswer,
      explanation: explanation,
      steps: steps,
    });
  }

  return results;
}

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}
