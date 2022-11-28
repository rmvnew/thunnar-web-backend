export enum VerifyCredentials {
    verify_email = 'email',
    verify_password = 'password'
}

export enum SqlType{
    SQL = 'SQL',
    NORMAL = 'NORMAL',
    BR = 'BR'
}

export enum SortingType {
    ID = 'ID',
    NAME = 'NAME',
    DATE = 'DATE',
    NUMBER = 'NUMBER',
    FIRST_DATE = 'FIRST_DATE',
    LAST_DATE = 'LAST_DATE'
}

export enum ShiftType {
    PRIMEIRO_TURNO = '1° Turno',
    SEGUNDO_TURNO = '2° Turno'
}

export enum ValidType {
    NO_SPACE = 'NO_SPACE',
    NO_MANY_SPACE = 'NO_MANY_SPACE',
    IS_STRING = 'IS_STRING',
    IS_NUMBER = 'IS_NUMBER',
    IS_NUMBER_FLOAT = 'IS_NUMBER_FLOAT',
    NO_SPECIAL_CHARACTER = 'NO_SPECIAL_CHARACTER',
    IS_EMAIL = 'IS_EMAIL',
    DATE = 'DATE',
    DATE_BR = 'DATE_BR',
    IS_CNPJ = 'IS_CNPJ'

}

export enum ObjectSize{
    INTEGER = 2147483646,
    DEFAULT_DAYS = 35
}

export enum DateOperation{
    ADD = 'ADD',
    REMOVE = 'REMOVE'
}

export enum TypeEmail{
    CREATE  = 'CREATE',
    RESET = 'RESET'
}


export enum OrderStatus{
    CREATED = 'CREATED',
    UNDER_ANALYSIS = 'UNDER_ANALYSIS',
    WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED ='FINISHED',
    CANCELED = 'CANCELED'
}

export enum DeviceStatus{
    RECEIVED = 'RECEIVED',
    UNDER_ANALYSIS = 'UNDER_ANALYSIS',
    WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
    IN_PROGRESS = 'IN_PROGRESS',
    FIXED_UP ='FIXED_UP',
    RETURNED = 'RETURNED'
}