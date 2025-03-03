import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import KustomCheckoutProviderService from "./service";

export default ModuleProvider(Modules.PAYMENT, {
    services: [KustomCheckoutProviderService],
});
