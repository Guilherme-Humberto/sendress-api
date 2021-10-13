import { prisma } from "config/prisma"
import { mailService } from "@core/aws/aws-ses"


class CreateEmailTemplate {
    async execute() {

        return await mailService.createTemplate({
            Template: {
                TemplateName: "Simple-For-Business",
                SubjectPart: "A simple email template for business",
                HtmlPart: `
                <div
                    style="background: #A7C6DB; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #fff; padding: 4rem 2rem;">
                    <h1 style="font-family: Arial, Helvetica, sans-serif; font-size: 5rem;">
                        BURGUNDY CORPORATION
                    </h1>
                    <p style="text-align: center;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos commodi hic veritatis,
                        labore eum id illo vero
                        consequuntur!</p>
                    <div
                        style="padding: 1rem 2rem; color: #222; font-size: 2rem; border-radius: 10rem; background: #fff; margin-top: 3rem;">
                        Conheça
                        nossa
                        marca</div>
                    </div>
                    <div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; margin: 4rem 0;">
                            <div>
                                <img style="object-fit: cover; max-height: 40rem; width: 100%;"
                                    src="https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                    alt="">
                                <p style="padding: 4rem;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ducimus alias,
                                    voluptate perspiciatis aperiam
                                    vel
                                    molestiae debitis illum quas voluptas beatae voluptates.</p>
                                <div
                                    style="padding: 1rem 2rem; color: #fff; font-size: 2rem; background: #A7C6DB; margin-left: 4rem; font-weight: bold; width: fit-content; font-family: Arial, Helvetica, sans-serif;">
                                    Venha desvendar</div>
                            </div>
                        </div>
                        <div>
                            <img style="object-fit: cover; max-height: 40rem; width: 100%;"
                                src="https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                alt="">
                        </div>
                    </div>
                    <div style="display: flex; gap: 8rem; padding: 0 3rem; margin-top: 5rem;">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ducimus alias, voluptate perspiciatis aperiam vel
                            molestiae debitis illum quas voluptas beatae voluptates. Dolores voluptate doloremque beatae enim laboriosam,
                            mollitia nulla dicta tempora expedita minima nihil cum laborum tempore autem illo officia maxime, voluptatem
                            quidem ratione. Illo excepturi odit eius autem. <br><br> Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                            Soluta ducimus alias, voluptate perspiciatis aperiam vel
                            molestiae debitis illum quas voluptas beatae voluptates. Dolores voluptate doloremque beatae enim laboriosam,
                            mollitia nulla dicta tempora expedita minima nihil cum laborum tempore autem illo officia maxime, voluptatem
                            quidem ratione. Illo excepturi odit eius autem.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos commodi hic veritatis,
                            labore eum id illo vero
                            consequuntur!</p>
                    </div>
                    <div
                        style="background: #A7C6DB; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; padding: 5rem 0;">
                        <h1>"To improve is to change;
                            to be perfect is to change often."</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid tempora natus maiores, mollitia ab
                            reprehenderit! Dolorem ut neque incidunt, sit illum praesentium! Fugit vero blanditiis quia suscipit praesentium
                            inventore maiores natus quidem obcaecati, similique commodi eligendi perferendis sequi nulla esse maxime cum
                            illum vel. Dignissimos dolore iusto quas rerum est corporis repellendus nisi placeat repellat? Est minus saepe
                            voluptatibus excepturi dolorem aliquam maiores, reprehenderit consectetur! Nobis consequatur pariatur, tempore
                            laborum autem aliquam perspiciatis, blanditiis, earum delectus atque exercitationem! Perspiciatis adipisci
                            voluptas quae, libero dicta reiciendis commodi. Exercitationem tempora quo cupiditate. <br><br>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid tempora natus maiores, mollitia ab
                            reprehenderit! Dolorem ut neque incidunt, sit illum praesentium! Fugit vero blanditiis quia suscipit praesentium
                            inventore maiores natus quidem obcaecati, similique commodi eligendi perferendis sequi nulla esse maxime cum
                            illum vel. Dignissimos dolore iusto quas rerum est corporis repellendus nisi placeat repellat? Est minus saepe
                            voluptatibus excepturi dolorem aliquam maiores, reprehenderit consectetur! Nobis consequatur pariatur, tempore
                            laborum autem aliquam perspiciatis, blanditiis, earum delectus atque exercitationem! Perspiciatis adipisci
                            voluptas quae, libero dicta reiciendis commodi. Exercitationem tempora quo cupiditate.</p>
                    </div>
                `
            }
        }).promise()
    }
}

export default new CreateEmailTemplate()