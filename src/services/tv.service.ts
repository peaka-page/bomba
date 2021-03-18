import { DateFromat, db, KeyVal } from "../common";

export namespace Enum {
  export enum Key {
    config = 'config',
    links = 'links',
    movies = 'movies',
    series = 'series'
  }
}
export namespace Model {

  export interface Link {
    url: string;
    filter?: string;
  }
  export class Config {
    categories: string[] = [];
    links: { movies: Link, series: Link }
    auth: KeyVal<string, string>[] = [];
    files_local: KeyVal<string, string>[] = [];
  }
  export class Media {
    @DateFromat(new Date(), 'mmmm-yyyy')
    id: string;
    @DateFromat(new Date(), 'dd/mm/yyyy')
    created: string;
    category: string;
    link: string;
    title: string;
    @DateFromat(new Date(), 'mmmm - yyyy')
    title_date: string
    imdb_ids: string[] = []
    file: string
  }
  export class Top {
    movies: Media[] = [];
    series: Media[] = []
  }
  export class Bank implements KeyVal<string, any>{
    key: string;
    val: any;
  }
}
export abstract class Activity {
  @db
  database: any = 'http://localhost:5984/tv'
  abstract create(props?: any): Promise<any>;
  abstract read(props?: any): Promise<any>;
  abstract update(props: any): Promise<any>;
  abstract delete(props: any): Promise<any>;
}
export class Config extends Activity {
  private _categories =  ["Action", "Adult", "Adventure", "Animation", "Biography"
    , "Comedy", "Crime", "Documentary", "Drama"
    , "Family", "Fantasy", "Film-Noir	", "Game-Show"
    , "History", "Horror", "Musical", "Music"
    , "Mystery", "News", "Reality-TV", "Romance"
    , "Sci-Fi", "Horror", "Short", "Sport"
    , "Talk-Show", "Thriller", "Short", "War", "Western"]
  async create(props?: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      let _config: Model.Config = {
        categories: this._categories,
        links: {
          movies: {
            url: 'https://www.imdb.com/search/title/?genres=',
            filter: '&groups=top_250&sort=year,desc'
          },
          series: {
            url: 'https://www.imdb.com/search/title/?title_type=tv_series,tv_miniseries&genres=',
            filter: 'crime&sort=year,desc'
          }
        },
        auth: [
          {
            key: 'omdb',
            val: '6547d8e&'
          }
        ],
        files_local: [
          {
            key: 'log-file',
            val: 'log_file.log'
          }
        ]
      }
      const create_config = await this.database.get(Enum.Key.config)
        .then((config: Config) => config)
        .catch(async err => {
          switch (err.status) {
            case 404:
              let new_config = await this.database.post({
                _id: Enum.Key.config,
                data: _config
              }).then(res => res).catch(err => err)
              await this.database.createIndex({
                index: {
                  fields: ['links.movies', 'links.series']
                }
              }).then(res => res).catch(err => err)

              new_config ? resolve({ success: true, message: new_config })
                : reject({ success: false, new_config })
          }
        })
      create_config ? resolve({ success: true, create_config })
        : reject({ success: false, create_config })
    });

  }
  async read(props?: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      if (!props) {
        let get_config = await this.database.get(Enum.Key.config)
        get_config ? resolve(get_config.data) : reject(get_config)
      }
      else {
        let get_config_by = await this.database.find(props).then(data => data).catch(err => err)
        get_config_by ? resolve(get_config_by.data) : reject(get_config_by)
      }
    });
  }
  async update(props: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      return await this.database.put(props).then(data => data).catch(err => err)
    });
  }
  async delete(props: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      return await this.database.delete(props).then(data => data).catch(err => err)
    });
  }
}
export class Tv extends Activity {
  async create(props?: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      const key = props.key;
      if (!key) reject('tv key not founded')
      
      const _config = await new Config().read();
      console.log(_config.categories)

      // let link: Model.Link = await this.database.get(Enum.Key.config)
      //   .then(res => res.data[Enum.Key.links][key])
      //   .catch(err => err)

      // if (!link) reject({ success: false, link })

      // const create_media = await this.database.get(key)
      //   .then((media: Model.Media) => media)
      //   .catch(async err => {
      //     switch (err.status) {
      //       case 404:
      //         let new_media = await this.database.post({
      //           _id: key,
      //           data: []
      //         }).then(res => res).catch(err => err)
      //         await this.database.createIndex({
      //           index: {
      //             fields: [key]
      //           }
      //         }).then(res => res).catch(err => err)

      //         create_media ? resolve({ success: true, message: create_media })
      //           : reject({ success: false, create_media })
      //     }
      //   })

      // if (!create_media) reject({ success: false, create_media })

      // let media = new Model.Media()
      
    });
  }
  read(props?: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(props: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  delete(props: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

}
export class Factory {
  public static Config: Config = new Config();
  public static Tv: Tv = new Tv();
}

const test = async () => {
  await Factory.Config.create();
  await Factory.Tv.create({ key: Enum.Key.movies }).then( await Factory.Tv.create({ key: Enum.Key.series }).then());
 
}
test()
