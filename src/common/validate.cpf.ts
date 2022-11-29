export class CheckCpf {

    private static instance: CheckCpf
    public static getInstance(): CheckCpf {
        if (!CheckCpf.instance) {
            CheckCpf.instance = new CheckCpf()
        }
        return CheckCpf.instance
    }


  isCpf(cpf: string) {
    const current_cpf = cpf.replace(/[^\d]+/g, '');
    if (current_cpf == '') return false;
    // Elimina CPFs invalidos conhecidos
    if (
      current_cpf.length != 11 ||
      current_cpf == '00000000000' ||
      current_cpf == '11111111111' ||
      current_cpf == '22222222222' ||
      current_cpf == '33333333333' ||
      current_cpf == '44444444444' ||
      current_cpf == '55555555555' ||
      current_cpf == '66666666666' ||
      current_cpf == '77777777777' ||
      current_cpf == '88888888888' ||
      current_cpf == '99999999999'
    )
      return false;
    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(current_cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(current_cpf.charAt(9))) return false;
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(current_cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(current_cpf.charAt(10))) return false;
    return true;
  }
}
