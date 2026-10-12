import { GradeLevel, SubjectType } from '../types';

export interface CurriculumTopicMap {
  [grade: number]: {
    Matematika: string[];
    Algebra?: string[];
  };
}

export const CURRICULUM: CurriculumTopicMap = {
  1: {
    Matematika: [
      '20 ichida qo‘shish va ayirish',
      '1 dan 100 gacha sonlarni taqqoslash',
      'Sodda matnli masalalar',
      'Geometrik shakllar (kvadrat, uchburchak, doira)',
      'Vaqt va o‘lchov birliklari (soat, santimetr)',
    ],
  },
  2: {
    Matematika: [
      '100 ichida qo‘shish va ayirish',
      'Ko‘paytirish va bo‘lish jadvaliga kirish',
      'Qavsli ifodalar va amallar tartibi',
      'Uzunlik va og‘irlik o‘lchov birliklari',
      'Ikki amalli matnli masalalar',
      'Geometrik figuralar va ularning tomonlari',
    ],
  },
  3: {
    Matematika: [
      'Ko‘paytirish va bo‘lish jadvali (to‘liq)',
      '1000 ichida qo‘shish va ayirish',
      'Qoldiqli bo‘lish',
      'Figuralarning perimetrini topish',
      'Murakkab matnli masalalar',
      'Vaqt va hajm o‘lchovlari',
    ],
  },
  4: {
    Matematika: [
      'Ko‘p xonali sonlar ustida to‘rt amal',
      'Harakatga oid masalalar (tezlik, vaqt, masofa)',
      'Yuzani hisoblash (kvadrat va to‘g‘ri to‘rtburchak)',
      'Noma’lum sonni topish (oddiy tenglamalar)',
      'Kasrlar haqida dastlabki tushunchalar',
      'Mantiqiy va kombinatorik masalalar',
    ],
  },
  5: {
    Matematika: [
      'Oddiy kasrlar va ular ustida amallar',
      'O‘nli kasrlar va yaxlitlash',
      'Natural sonlarning bo‘linish belgilari',
      'Foizlar va nisbatlar',
      'Burchaklar, ko‘pburchaklar va perimetr',
      'O‘rta arifmetik qiymat',
    ],
  },
  6: {
    Matematika: [
      'EKUB va EKUK ni topish',
      'Musbat va manfiy sonlar (ratsional sonlar)',
      'Proporsiya va to‘g‘ri proporsional miqdorlar',
      'Bir noma’lumli chiziqli tenglamalar',
      'Aylana uzunligi va doira yuzi',
      'Koordinatalar to‘g‘ri chizig‘i va tekisligi',
    ],
  },
  7: {
    Matematika: [
      'Ratsional sonlar ustida amallar',
      'Nisbat, proporsiya va foiz masalalari',
      'Koordinatalar tekisligi va nuqtalar',
      'Uchburchaklar va ularning tenglik alomatlari',
      'Burchaklar va ularning xossalari',
    ],
    Algebra: [
      'Algebraik ifodalar va ularning qiymati',
      'Bir noma’lumli chiziqli tenglamalar',
      'Birhadlar va ko‘phadlar ustida amallar',
      'Qisqa ko‘paytirish formulalari',
      'Chiziqli funksiya va uning grafigi',
      'Natural ko‘rsatkichli daraja va uning xossalari',
    ],
  },
  8: {
    Matematika: [
      'To‘rtburchaklar va ularning turlari',
      'Pifagor teoremasi',
      'Ko‘pburchaklar yuzini hisoblash',
      'Vektorlar va koordinatalar',
    ],
    Algebra: [
      'Arifmetik kvadrat ildizlar va xossalari',
      'Kvadrat tenglamalar va diskriminant',
      'Viyet teoremasi',
      'Ratsional kasrlar va almashtirishlar',
      'Chiziqli tengsizliklar va tengsizliklar sistemasi',
      'Kvadrat tenglamaga keltiriladigan tenglamalar',
    ],
  },
  9: {
    Matematika: [
      'O‘xshash uchburchaklar',
      'Aylana va unga chizilgan burchaklar',
      'Trigonometrik munosabatlar (sin, cos, tg)',
      'Koordinatalar usuli va vektorlar',
    ],
    Algebra: [
      'Kvadrat funksiya va uning grafigi',
      'Ikki noma’lumli tenglamalar sistemasi',
      'Arifmetik progressiya va hadlari yig‘indisi',
      'Geometrik progressiya',
      'Kombinatorika elementlari (o‘rinlashtirish, guruhlash)',
      'Trigonometriya asoslari',
    ],
  },
  10: {
    Matematika: [
      'Fazoda to‘g‘ri chiziq va tekisliklar',
      'Ko‘pyoqlar (prizma, piramida)',
      'Aylanish jismlari (silindr, konus, shar)',
      'Fazoda burchaklar va masofalar',
    ],
    Algebra: [
      'Ratsional ko‘rsatkichli darajalar',
      'Ko‘rsatkichli tenglamalar va tengsizliklar',
      'Logarifm va uning xossalari',
      'Logarifmik tenglamalar va tengsizliklar',
      'Trigonometrik ayniyatlar va tenglamalar',
      'Funksiyaning davriyligi va teskari funksiyalar',
    ],
  },
  11: {
    Matematika: [
      'Fazoviy jismlarning sirtlari va hajmlari',
      'Fazoda vektorlar va koordinatalar',
      'Ko‘pyoqlarning kesimlari',
      'Kombinatsiyalangan stereometriya masalalari',
    ],
    Algebra: [
      'Hosila va uning fizik/geometrik ma’nosi',
      'Funksiyaning o‘sish/kamayishi va ekstremumlari',
      'Boshlang‘ich funksiya va aniq integral',
      'Integral yordamida yuzalarni hisoblash',
      'Ehtimollar nazariyasi va matematik statistika',
      'Murakkab parametrik tenglamalar',
    ],
  },
};

export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 30, 50];
