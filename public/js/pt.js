ReactIntl.__addLocaleData({"locale":"pt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return t0&&n>=0&&n<=2&&n!=2?"one":"other"},"fields":{"year":{"displayName":"Ano","relative":{"0":"este ano","1":"próximo ano","-1":"ano passado"},"relativeTime":{"future":{"one":"Dentro de {0} ano","other":"Dentro de {0} anos"},"past":{"one":"Há {0} ano","other":"Há {0} anos"}}},"month":{"displayName":"Mês","relative":{"0":"este mês","1":"próximo mês","-1":"mês passado"},"relativeTime":{"future":{"one":"Dentro de {0} mês","other":"Dentro de {0} meses"},"past":{"one":"Há {0} mês","other":"Há {0} meses"}}},"day":{"displayName":"Dia","relative":{"0":"hoje","1":"amanhã","2":"depois de amanhã","-1":"ontem","-2":"anteontem"},"relativeTime":{"future":{"one":"Dentro de {0} dia","other":"Dentro de {0} dias"},"past":{"one":"Há {0} dia","other":"Há {0} dias"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"Dentro de {0} hora","other":"Dentro de {0} horas"},"past":{"one":"Há {0} hora","other":"Há {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"Dentro de {0} minuto","other":"Dentro de {0} minutos"},"past":{"one":"Há {0} minuto","other":"Há {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"agora"},"relativeTime":{"future":{"one":"Dentro de {0} segundo","other":"Dentro de {0} segundos"},"past":{"one":"Há {0} segundo","other":"Há {0} segundos"}}}}});
ReactIntl.__addLocaleData({"locale":"pt-AO","parentLocale":"pt-PT"});
ReactIntl.__addLocaleData({"locale":"pt-PT","parentLocale":"pt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Ano","relative":{"0":"este ano","1":"próximo ano","-1":"ano passado"},"relativeTime":{"future":{"one":"dentro de {0} ano","other":"dentro de {0} anos"},"past":{"one":"há {0} ano","other":"há {0} anos"}}},"month":{"displayName":"Mês","relative":{"0":"este mês","1":"próximo mês","-1":"mês passado"},"relativeTime":{"future":{"one":"dentro de {0} mês","other":"dentro de {0} meses"},"past":{"one":"há {0} mês","other":"há {0} meses"}}},"day":{"displayName":"Dia","relative":{"0":"hoje","1":"amanhã","2":"depois de amanhã","-1":"ontem","-2":"anteontem"},"relativeTime":{"future":{"one":"dentro de {0} dia","other":"dentro de {0} dias"},"past":{"one":"há {0} dia","other":"há {0} dias"}}},"hour":{"displayName":"Hora","relativeTime":{"future":{"one":"dentro de {0} hora","other":"dentro de {0} horas"},"past":{"one":"há {0} hora","other":"há {0} horas"}}},"minute":{"displayName":"Minuto","relativeTime":{"future":{"one":"dentro de {0} minuto","other":"dentro de {0} minutos"},"past":{"one":"há {0} minuto","other":"há {0} minutos"}}},"second":{"displayName":"Segundo","relative":{"0":"agora"},"relativeTime":{"future":{"one":"dentro de {0} segundo","other":"dentro de {0} segundos"},"past":{"one":"há {0} segundo","other":"há {0} segundos"}}}}});
ReactIntl.__addLocaleData({"locale":"pt-BR","parentLocale":"pt"});
ReactIntl.__addLocaleData({"locale":"pt-CV","parentLocale":"pt-PT"});
ReactIntl.__addLocaleData({"locale":"pt-GW","parentLocale":"pt-PT"});
ReactIntl.__addLocaleData({"locale":"pt-MO","parentLocale":"pt-PT"});
ReactIntl.__addLocaleData({"locale":"pt-MZ","parentLocale":"pt-PT"});
ReactIntl.__addLocaleData({"locale":"pt-ST","parentLocale":"pt-PT"});
ReactIntl.__addLocaleData({"locale":"pt-TL","parentLocale":"pt-PT"});

//! moment.js locale configuration
//! locale : brazilian portuguese (pt-br)
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
  && typeof require === 'function' ? factory(require('../moment')) :
    typeof define === 'function' && define.amd ? define(['moment'], factory) :
      factory(global.moment)
}(this, function (moment) { 'use strict';


  var pt_br = moment.defineLocale('pt-BR', {
    months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
    weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
    weekdaysMin : 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
    longDateFormat : {
      LT : 'HH:mm',
      LTS : 'HH:mm:ss',
      L : 'DD/MM/YYYY',
      LL : 'D [de] MMMM [de] YYYY',
      LLL : 'D [de] MMMM [de] YYYY [às] HH:mm',
      LLLL : 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
    },
    calendar : {
      sameDay: '[Hoje às] LT',
      nextDay: '[Amanhã às] LT',
      nextWeek: 'dddd [às] LT',
      lastDay: '[Ontem às] LT',
      lastWeek: function () {
        return (this.day() === 0 || this.day() === 6) ?
          '[Último] dddd [às] LT' : // Saturday + Sunday
          '[Última] dddd [às] LT'; // Monday - Friday
      },
      sameElse: 'L'
    },
    relativeTime : {
      future : 'em %s',
      past : '%s atrás',
      s : 'poucos segundos',
      m : 'um minuto',
      mm : '%d minutos',
      h : 'uma hora',
      hh : '%d horas',
      d : 'um dia',
      dd : '%d dias',
      M : 'um mês',
      MM : '%d meses',
      y : 'um ano',
      yy : '%d anos'
    },
    ordinalParse: /\d{1,2}º/,
    ordinal : '%dº'
  });

  return pt_br;

}));
