import axios from 'axios';

export interface City {
    name: string;
    region?: string;
}

export class CitiesService {
    private readonly apiKey: string = 'fe86a9037a3506ab0db939b613365bdc';
    private readonly apiUrl: string = 'https://api.novaposhta.ua/v2.0/json/';
    private timeout: NodeJS.Timeout | null | number = null;

    async getCities(query: string): Promise<City[]> {
        try {
            const response = await axios.post(this.apiUrl, {
                apiKey: this.apiKey,
                modelName: 'Address',
                calledMethod: 'searchSettlements',
                methodProperties: {
                    CityName: query,
                    Limit: 10,
                    Page: 1,
                },
            });

            if (!response.data.success) {
                throw new Error(response.data.errors.join(', ') || 'API request failed');
            }

            const addresses = response.data.data[0]?.Addresses || [];
            return addresses.map((item: any) => ({
                name: item.Present,
                region: item.Region || '',
            }));
        } catch (error: any) {
            console.error('Nova Poshta API error:', {
                message: error.message,
                response: error.response?.data,
            });
            return [];
        }
    }

    searchCities(query: string, callback: (cities: City[]) => void): () => void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        if (query.length < 1) {
            callback([]);
            return () => {};
        }

        this.timeout = setTimeout(async () => {
            const fetchedCities = await this.getCities(query);
            callback(fetchedCities);
        }, 400);

        return () => {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
        };
    }
}