using AutoMapper;
using CandellaServer.Data;
using CandellaServer.Dto;

namespace CandellaServer.Helpers
{
    public class MapperInitalizer
    {
        public class MapperInitializer
        {
            private static readonly object _locker = new object();
            public static void Initialize()
            {
                lock (_locker)
                {
                    Mapper.Reset();
                    Mapper.Initialize(cfg =>
                    {
                        cfg.CreateMap<Director, DirectorDto>().ForMember(
                            dest => dest.Email,
                            opt => opt.MapFrom(src => src.IdentityUser.Email));

                        cfg.CreateMap<Client, ClientDto>().ForMember(
                            dest => dest.Email,
                            opt => opt.MapFrom(src => src.IdentityUser.Email));

                        cfg.CreateMap<Employee, EmployeeDto>().ForMember(
                            dest => dest.Email,
                            opt => opt.MapFrom(src => src.IdentityUser.Email));

                        cfg.CreateMap<Department, DepartmentDto>();
                        cfg.CreateMap<ToDo, ToDoDto>();
                    });
                }
            }

        }
    }
}
