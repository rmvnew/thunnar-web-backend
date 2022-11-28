


export class ExternalUrl{


    private static instance: ExternalUrl
    public static getInstance(): ExternalUrl {
        if (!ExternalUrl.instance) {
            ExternalUrl.instance = new ExternalUrl()
        }
        return ExternalUrl.instance
    }


    getCounters(){
        return `https://api-counters.nddprint.com/CountersWS/CountersData.asmx?wsdl`
    }

    getCompanyNdd(){
        return `https://api-general.nddprint.com/GeneralWS/GeneralData.asmx?wsdl`
    }

}