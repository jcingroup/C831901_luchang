using OutWeb.Models.api;

namespace OutWeb.Models
{
    public class GridResultBaseModel : JsonResultBase
    {
        public GridBaseFilterModel filter { get; set; } = new GridBaseFilterModel();
        public PaginationModel page { get; set; } = new PaginationModel();
    }
}