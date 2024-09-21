import { useState } from "react"

import { Modal } from "antd"
import { CrownFilled } from "@ant-design/icons"


function Premium({ children, className = "" }) {

    const [premiumModalOpen, setPremiumModalOpen] = useState(false)


    const onClick = () => {
        setPremiumModalOpen(true)
    }

    const onClose = (event) => {
        event.stopPropagation()
        setPremiumModalOpen(false)
    }

    // FIXME: the pricing section is not responsive
    return (
        <div onClick={onClick} className={`${className}`}>
            {children}
            <Modal
                title={<h3 className="tw-text-xl tw-font-medium">Buy Pre-order one Time License</h3>}
                style={{ zIndex: 14000, gap: '10px', maxWidth: '80vw', placeItems: "center" }}
                onCancel={onClose}
                centered
                onOk={onClose}
                footer={null}
                width={'auto'}
                open={premiumModalOpen}
            >
                <div className="tw-mt-5 tw-text-lg tw-max-w-[850px] tw-w-full ">
                    I am Paul, an open-source dev, funding open-source projects by providing custom works.
                    If you find this tool useful and want to support its development, consider buying a <b>one time license</b>.
                    <br />
                    <br />
                    By buying pre-order license, you get advance features, priority support, early access, upcoming features, and more.
                    <a
                        href="https://github.com/PaulleDemon/tab=readme-ov-file"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="!tw-text-blue-500"
                    >
                        more.
                    </a>
                </div>

                <section className="tw-mt-1 tw-flex tw-w-full tw-flex-col tw-place-items-center tw-p-[2%] max-lg:tw-p-2" id="pricing">
                    <h3 className="tw-text-2xl tw-font-medium max-md:tw-text-2xl">Choose your plan</h3>
                    <div className="tw-mt-10 tw-flex tw-place-content-center tw-gap-8 max-lg:tw-flex-col">
                        {/* Free Plan */}
                        <div className="tw-flex tw-w-[380px] tw-border-[1px] tw-border-gray-500 tw-border-solid tw-flex-col tw-place-items-center tw-gap-2 tw-rounded-lg tw-p-8 tw-shadow-xl max-lg:tw-w-[340px]">
                            <h3>
                                <span className="tw-text-5xl tw-font-semibold">$0</span>
                            </h3>
                            <p className="tw-mt-3 tw-text-base tw-text-center tw-text-gray-600">
                                Free to use forever, but for added features and to support open-source development, consider buying a lifetime license.
                            </p>
                            <hr />
                            <ul className="tw-mt-4 tw-flex tw-flex-col tw-gap-3 tw-text-xl tw-text-gray-600">
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Access to web-based editor</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Commercial use</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Downloadable UI builder exe for local development</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Support for PySlide/PyQt</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Preview live</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Save and load files</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Load plugins locally</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Dark theme</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Priority support</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Early access to new features</span>
                                </li>
                                
                            </ul>
                        </div>

                        {/* Paid Plan */}
                        <div className="tw-flex tw-w-[380px] tw-flex-col tw-place-items-center tw-gap-2 tw-rounded-lg tw-border-2 tw-border-solid
                                         tw-border-blue-500 tw-p-8 tw-shadow-xl max-lg:tw-w-[340px]">
                            <div className="tw-text-white tw-p-1 tw-px-3 tw-bg-blue-500 tw-rounded-full">
                                Limited time offer
                            </div>
                            <div className="tw-text-white tw-font-medium tw-p-1 tw-px-3 tw-bg-green-700 tw-rounded-full">
                                Hobby
                            </div>
                            <h3>
                                <span className="tw-text-5xl tw-font-semibold">
                                    <s className="tw-font-medium tw-text-4xl">$129</s>
                                    <span>$29</span>
                                </span>
                                <span className="tw-text-2xl tw-text-gray-600">Forever</span>
                            </h3>
                            <p className="tw-mt-3 tw-text-center tw-text-gray-600">
                                Support open-source development 🚀. Plus, get added benefits.
                            </p>
                            <hr />
                            <ul className="tw-mt-4 tw-flex tw-flex-col tw-gap-3 tw-text-xl tw-text-gray-600">
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Access to web-based editor</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Downloadable UI builder exe for local development</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Preview live</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Save and load files</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Load plugins locally</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Dark theme</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Priority support</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Early access to new features</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Support for PySlide/PyQt</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-x-circle-fill tw-text-red-600 tw-text-base"></i>
                                    <span>Commercial use</span>
                                </li>
                                
                            </ul>

                            <a
                                href=""
                                target="_blank"
                                rel="noreferrer noopener"
                                className="tw-mt-8 !tw-bg-purple-500 !tw-text-white tw-gap-2 tw-text-lg tw-rounded-md !tw-font-semibold tw-w-full tw-flex tw-place-content-center tw-p-2 tw-mx-2"
                            >
                                <span>Buy License</span>
                                <CrownFilled />
                            </a>
                        </div>

                        {/* Paid Plan */}
                        <div className="tw-flex tw-w-[380px] tw-flex-col tw-place-items-center tw-gap-2 tw-rounded-lg tw-border-2 tw-border-solid
                                         tw-border-green-600 tw-p-8 tw-shadow-xl max-lg:tw-w-[340px]">
                            <div className="tw-text-white tw-p-1 tw-px-3 tw-bg-blue-500 tw-rounded-full">
                                Limited time offer
                            </div>
                            <div className="tw-text-white tw-font-medium tw-p-1 tw-px-3 tw-bg-green-700 tw-rounded-full">
                                Commercial
                            </div>
                            <h3>
                                <span className="tw-text-5xl tw-font-semibold">
                                    <s className="tw-font-medium tw-text-4xl">$180</s>
                                    <span>$49</span>
                                </span>
                                <span className="tw-text-2xl tw-text-gray-600">Forever</span>
                            </h3>
                            <p className="tw-mt-3 tw-text-center tw-text-gray-600">
                                Support open-source development 🚀. Plus, get added benefits.
                            </p>
                            <hr />
                            <ul className="tw-mt-4 tw-flex tw-flex-col tw-gap-3 tw-text-xl tw-text-gray-600">
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Access to web-based editor</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Downloadable UI builder exe for local development</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Preview live</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Save and load files</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Load plugins locally</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Dark theme</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Priority support</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Early access to new features</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Support for PySlide/PyQt</span>
                                </li>
                                <li className="tw-flex tw-place-items-center tw-gap-2">
                                    <i className="bi bi-check-circle-fill tw-text-green-600 tw-text-base"></i>
                                    <span>Commercial use</span>
                                </li>
                                
                            </ul>

                            <a
                                href=""
                                target="_blank"
                                rel="noreferrer noopener"
                                className="tw-mt-8 !tw-bg-purple-500 !tw-text-white tw-gap-2 tw-text-lg tw-rounded-md !tw-font-semibold tw-w-full tw-flex tw-place-content-center tw-p-2 tw-mx-2"
                            >
                                <span>Buy License</span>
                                <CrownFilled />
                            </a>
                        </div>
                    </div>
                </section>

            
            </Modal>

        </div>
    )

}

export default Premium