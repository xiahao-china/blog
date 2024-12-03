import Router from "koa-router";
import {
  addEquipmentControllers, adminCreateEquipmentControllers, delEquipmentControllers,
  equipmentListControllers, equipmentSearchOnlineControllers, optionsEquipmentControllers
} from "@/controllers/equipment";

export default (router: Router) => {
  router.post("/equipment/list", equipmentListControllers);
  router.post("/equipment/searchOnline", equipmentSearchOnlineControllers);
  // router.post("/equipment/detail", articleListControllers);
  router.post("/equipment/options", optionsEquipmentControllers);
  router.post("/equipment/del", delEquipmentControllers);
  router.post("/equipment/add", addEquipmentControllers);

  router.post("/admin/createEquipment", adminCreateEquipmentControllers);
}
