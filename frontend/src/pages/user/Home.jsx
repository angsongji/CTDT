const Home = () => {
    return (
        <div>
            <div className="p-5 ">
            <img src="schoolSGU.jpg" className="w-[100%]" />
            </div>
            <div className="relative w-full h-fit flex items-center py-20 px-10 bg-white my-20">
            <div className="w-3/4 flex flex-col items-end">
                <h2 className="text-5xl font-bold text-black uppercase ">Nhiệm vụ</h2>
                
                <div className="mt-4 text-lg text-gray-700 leading-relaxed self-center">
                    <ul className="mt-4 text-lg text-gray-700 list-disc pl-6 leading-relaxed ">
                        <li>Xây dựng kế hoạch và đề xuất chỉ tiêu tuyển sinh hàng năm; phối hợp với các đơn vị xây dựng đề án mở mã ngành đào tạo, tổ chức tuyển sinh, đào tạo hệ đại học chính quy.</li>
                        <li>Xây dựng kế hoạch đào tạo năm học, quản lí, tổ chức thực hiện các hoạt động đào tạo.</li>
                        <li>Tổ chức rà soát, đánh giá, cập nhật chương trình đào tạo.</li>
                        <li>Phối hợp quản trị và phát triển hệ thống phần mềm quản lí đào tạo.</li>
                        <li>Phối hợp với các đơn vị quản lí khối lượng công tác của cán bộ, giảng viên.</li>
                    </ul>
                </div>
            </div>

            {/* Hình ảnh bên phải */}
            <img
                src="target.png"
                alt="Mục tiêu"
                className="absolute right-[10%] h-[80%] w-auto opacity-40"
            />
        </div>
        </div>
    );
};

export default Home;
