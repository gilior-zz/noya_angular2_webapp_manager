using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using noya_angular2_webapp_manager.Dal;
using System.Configuration;
using Newtonsoft.Json.Linq;

namespace noya_angular2_webapp_manager.apicontrollers
{
    public class DataController : ApiController
    {
        [AcceptVerbs("Post")]
        public MenuResponse GetMenuItems(dynamic request)
        {
            var dataRequest = this.ConvertStupidArgumentToNormalRequset<DataRequest>(request);
            SqlConnection connection = initializeConnection();
            var res = new MenuResponse();
            var menuItemsList = new List<MenuItem>();
            try
            {
                connection.Open();
                SqlCommand cmd = new SqlCommand("MenuItemsSelect", connection);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        double order = Convert.ToDouble(reader["Order"]);
                        int id = Convert.ToInt32(reader["ID"]);
                        string text_English = reader["Text_English"].ToString();
                        string Text_Hebrew = reader["Text_Hebrew"].ToString();
                        bool isDefault = bool.Parse(reader["IsDefault"].ToString());
                        var item = new MenuItem(id, order, text_English, Text_Hebrew, isDefault);
                        menuItemsList.Add(item);
                    }
                }
                res.MenuItems = menuItemsList.ToArray();
                return res;
            }


            finally
            {
                connection.Close();
            }
        }

        [AcceptVerbs("Post")]
        public LinksResponse GetLinks(dynamic request)
        {
            var dataRequest = this.ConvertStupidArgumentToNormalRequset<DataRequest>(request);
            LinksResponse res = new LinksResponse();
            SqlConnection connection = initializeConnection();
            try
            {
                connection.Open();
                SqlCommand cmd = new SqlCommand("LinksSelect", connection);
                cmd.Parameters.AddWithValue("@txt_lang", "Text_Eng");
                cmd.Parameters.AddWithValue("@add_lang", "Address_Eng");
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                List<Link> linksList = new List<Link>();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var id = Convert.ToInt32(reader["ID"].ToString());
                        var text_heb = reader["Text_Heb"].ToString();
                        var address_heb = reader["Address_Heb"].ToString();
                        var text_eng = reader["Text_Eng"].ToString();
                        var address_eng = reader["Address_Eng"].ToString();
                        var order = Convert.ToDouble(reader["Order"].ToString());
                        var timestamp = Convert.ToDateTime(reader["Date"].ToString());
                        var link = new Link(id, text_heb, address_heb, text_eng, address_eng, order, timestamp);
                        linksList.Add(link);
                    }
                }
                res.Links = linksList.ToArray();
                return res;
            }
            finally
            {
                connection.Close();
            }
        }


        [AcceptVerbs("Post")]
        public UpdateRsponse GetUpdates(object request)
        {

            var calendarRequest = this.ConvertStupidArgumentToNormalRequset<DataRequest>(request);
            SqlConnection con = initializeConnection();
            try
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("HotUpdatesSelect", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@lang", "Data_Eng");
                List<Update> updates = new List<Update>();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Update update = new Update()
                        {
                            ID = Convert.ToInt32(reader["ID"]),
                            Order = Convert.ToDouble(reader["Order"]),
                            Data_Heb = reader["Data_Heb"].ToString(),
                            Data_Eng = reader["Data_Eng"].ToString(),
                            TimeStamp = Convert.ToDateTime(reader["TimeStamp"]),
                        };
                        updates.Add(update);
                    }
                }
                return new UpdateRsponse() { Updates = updates.ToArray() };

            }
            finally
            {
                con.Close();
            }
        }

        [AcceptVerbs("Post")]
        public PressResponse GetPress(object request)
        {

            var calendarRequest = this.ConvertStupidArgumentToNormalRequset<DataRequest>(request);
            SqlConnection con = initializeConnection();
            try
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("PressSelect", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@lang", "Eng");
                List<PressItem> presses = new List<PressItem>();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        PressItem item = new PressItem()
                        {
                            ID = Convert.ToInt32(reader["ID"]),

                            Eng = reader["Eng"].ToString(),
                            Heb = reader["Heb"].ToString(),
                            TimeStamp = Convert.ToDateTime(reader["TimeStamp"]),
                        };
                        presses.Add(item);
                    }
                }
                return new PressResponse() { PressItems = presses.ToArray() };

            }
            finally
            {
                con.Close();
            }
        }

        [AcceptVerbs("Post")]
        public CalendarResponse GetCalendar(object request)
        {
            var calendarRequest = this.ConvertStupidArgumentToNormalRequset<CalendarRequset>(request);
            SqlConnection con = initializeConnection();
            try
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("CalendarItemSelect_New", con);
                cmd.Parameters.AddWithValue("@lang", "Text_Eng");
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                List<CalendarItem> list = new List<CalendarItem>();
                CalendarItem resultItem = null;
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        CalendarItem item = new CalendarItem();
                        item.TimeStamp = Convert.ToDateTime(reader["TimeStamp"]);
                        item.Visible = Convert.ToBoolean(reader["Visible"]);
                        item.Text_Eng = reader["Text_Eng"].ToString();
                        item.DataDate = Convert.ToDateTime(reader["DataDate"]).Date;
                        item.ID = Convert.ToInt32(reader["ID"]);
                        list.Add(item);
                    }
                }

                return new CalendarResponse() { CalendarItems = list.ToArray() };
            }
            finally
            {
                con.Close();
            }
        }

        private static SqlConnection initializeConnection()
        {
            SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["noyaDB"].ConnectionString);

            return connection;
        }

        [AcceptVerbs("Post")]
        public ProgramsResponse GetPrograms(DataRequest request)
        {

            SqlConnection connection = initializeConnection();
            try
            {
                connection.Open();
                SqlCommand cmd = new SqlCommand("ProgramsSelect", connection);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@lang", "Eng");
                List<Program> prgs = new List<Program>();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Program prg = new Program();
                        prg.ID = Convert.ToInt32(reader["ID"].ToString());
                        prg.Name = reader["Name"].ToString();
                        prg.Heb = reader["Heb"].ToString();
                        prg.Eng = reader["Eng"].ToString();
                        prg.Order = Convert.ToDouble(reader["Order"].ToString());
                        prg.TimeStamp = Convert.ToDateTime(reader["TimeStamp"].ToString());
                        prgs.Add(prg);
                    }

                }
                return new ProgramsResponse() { Programs = prgs.ToArray() };
            }
            finally
            {

                connection.Close();
            }

        }

        [AcceptVerbs("Post")]
        public CVResponse GetCV(DataRequest request)
        {

            SqlConnection connection = initializeConnection();
            try
            {
                connection.Open();
                SqlCommand cmd = new SqlCommand("CVSelect", connection);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@lang", "Eng");
                List<CV> cvs = new List<CV>();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        CV cv = new CV();
                        cv.ID = Convert.ToInt32(reader["ID"].ToString());
                        cv.Eng = reader["Eng"].ToString();
                        cv.Heb = reader["Heb"].ToString();
                        cv.TimeStamp = Convert.ToDateTime(reader["TimeStamp"].ToString());
                        cvs.Add(cv);
                    }
                }
                return new CVResponse() { CVs = cvs.ToArray() };
            }
            finally
            {
                connection.Close();
            }

        }

        [AcceptVerbs("Post")]
        public ImageGalleryResponse GetImages(object request)
        {

            ImageGalleryRequest imageGalleryRequest = this.ConvertStupidArgumentToNormalRequset<ImageGalleryRequest>(request);
            ImageGalleryItem item = null;
            SqlConnection con = initializeConnection();
            try
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("ImagesGallery_NewSelect", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                List<ImageGalleryItem> rawList = new List<ImageGalleryItem>();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        ImageGalleryItem imageGalleryItem = new ImageGalleryItem()
                        {
                            ID = Convert.ToInt32(reader["ID"]),
                            ImageName = Convert.ToString(reader["ImageName"]),
                            Order = Convert.ToDouble(reader["Order"]),
                            TimeStamp = Convert.ToDateTime(reader["TimeStamp"]),
                            Visible = Convert.ToBoolean(reader["Visible"])
                        };
                        rawList.Add(imageGalleryItem);
                    }
                }

                ImageGalleryResponse imageGalleryResponse = null;


                return imageGalleryResponse;
            }
            catch (Exception)
            {

                throw;
            }
        }
        private T ConvertStupidArgumentToNormalRequset<T>(object request) where T : DataRequest
        {
            JObject jObject = JObject.Parse(request.ToString());
            var parsed = jObject.First.FirstOrDefault().ToObject<T>();
            return parsed;
        }
    }
}